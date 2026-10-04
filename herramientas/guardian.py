"""Guardián (hook PreToolUse): bloquea acciones peligrosas antes de que se ejecuten.

Claude Code lo llama con el JSON de la herramienta por stdin (Bash, WebFetch, WebSearch).
Responde "deny" con el motivo cuando una regla se cumple; si no, deja pasar.
Registra cada sitio visitado y cada búsqueda en estado/accesos.log.
"""
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

RAIZ = Path(__file__).resolve().parent.parent
LOG = RAIZ / "estado" / "accesos.log"
RAMA = "claude/shopify-autonomous-agent-d55vw7"
SECRETOS = ("DROPI_CLAVE", "DROPI_USUARIO")
DOMINIOS_SECRETOS = ("dropi.cl",)

# Acortadores, subida de archivos y receptores de datos: sirven para sacar información.
DOMINIOS_BLOQUEADOS = (
    "bit.ly", "tinyurl.com", "t.co", "goo.gl", "cutt.ly", "is.gd", "rebrand.ly",
    "pastebin.com", "paste.ee", "hastebin.com", "ghostbin.com", "transfer.sh", "file.io",
    "0x0.st", "anonfiles.com", "gofile.io", "mega.nz", "wetransfer.com", "ngrok.io",
    "ngrok-free.app", "webhook.site", "requestbin.com", "pipedream.net", "interact.sh",
    "burpcollaborator.net", "discord.com/api/webhooks", "api.telegram.org",
)
# Dinero, cuentas y anuncios: siempre son portón humano.
RUTAS_DINERO = re.compile(r"(retiro|retirar|withdraw|payout|wallet|billetera|transfer|pago|checkout|adaccount|/ads\b|/campaigns\b|/adsets\b)", re.I)
URL = re.compile(r"https?://[^\s'\"<>|)]+", re.I)


def registrar(tipo, detalle):
    if os.environ.get("GUARDIAN_SIN_LOG"):
        return
    try:
        LOG.parent.mkdir(exist_ok=True)
        with LOG.open("a", encoding="utf-8") as fh:
            fh.write(f"{datetime.now(timezone.utc):%Y-%m-%d %H:%M:%SZ}\t{tipo}\t{detalle[:300]}\n")
    except OSError:
        pass


def host(url):
    try:
        return (urlparse(url).hostname or "").lower()
    except ValueError:
        return ""


def es_de(h, dominio):
    return h == dominio or h.endswith("." + dominio)


def bloqueado(url):
    h, u = host(url), url.lower()
    for d in DOMINIOS_BLOQUEADOS:
        if "/" in d:
            if d in u:
                return d
        elif es_de(h, d):
            return d
    return None


def revisar_bash(cmd):
    c = " ".join(cmd.split())
    urls = URL.findall(c)

    # 1. Credenciales: nunca imprimirlas ni enviarlas fuera de Dropi.
    usa_secreto = any(s in c for s in SECRETOS) or any(
        os.environ.get(s) and os.environ[s] in c for s in SECRETOS)
    if usa_secreto:
        if re.search(r"\b(echo|printf|cat|env|printenv|set|export -p|tee)\b", c) and not urls:
            return "No se pueden mostrar ni copiar las credenciales de Dropi."
        if re.search(r">\s*[^&\s]", c):
            return "No se pueden escribir las credenciales de Dropi en archivos."
        fuera = [u for u in urls if not any(es_de(host(u), d) for d in DOMINIOS_SECRETOS)]
        if fuera or not urls:
            return "Las credenciales de Dropi solo pueden enviarse a dropi.cl."

    # 2. Sitios bloqueados.
    for u in urls:
        if d := bloqueado(u):
            return f"Sitio bloqueado por seguridad: {d}."
        registrar("bash-url", u)

    # 3. Dinero, retiros y anuncios con método que modifica (POST/PUT/DELETE).
    if re.search(r"(-X\s*(POST|PUT|PATCH|DELETE)|--data|-d\s|--form|-F\s|requests\.(post|put|delete))", c, re.I):
        for u in urls:
            if RUTAS_DINERO.search(u) or es_de(host(u), "graph.facebook.com"):
                return "Acciones de dinero, retiros o anuncios son portón humano: no se ejecutan automáticamente."

    # 4. Git: solo la rama de trabajo, sin reescribir historia.
    # Solo segmentos que realmente son "git push" (no texto dentro de mensajes de commit).
    for seg in re.split(r"&&|\|\||;|\n", cmd):
        partes = seg.split()
        if len(partes) < 2 or partes[0] != "git" or partes[1] != "push":
            continue
        args = partes[2:]
        if any(a in ("-f", "-d", "--delete", "--mirror") or a.startswith(("--force", ":", "+")) for a in args):
            return "Push forzado o borrado de ramas bloqueado."
        posicionales = [a for a in args if not a.startswith("-")]
        if any(d not in (RAMA, f"HEAD:{RAMA}", f"{RAMA}:{RAMA}") for d in posicionales[1:]):
            return f"Solo se permite push a la rama {RAMA}."
    if re.search(r"\bgit\s+(filter-branch|filter-repo|update-ref\s+-d)\b", c):
        return "Reescritura de historial bloqueada."

    # 5. Borrados masivos.
    if re.search(r"\brm\s+(-\w*[rR]\w*\s+)+(-\w+\s+)*(/|~|\$HOME|\.\.?/?|\*|\.git)(\s|$)", c):
        return "Borrado masivo bloqueado."

    # 6. Ejecutar código descargado o instalar paquetes de fuentes raras.
    if re.search(r"(curl|wget)[^|;&]*\|\s*(sudo\s+)?(ba|z|da)?sh\b", c):
        return "Ejecutar scripts descargados directamente está bloqueado."
    if re.search(r"\bpip3?\s+install\b.*(git\+|https?://|--index-url|--extra-index-url|-i\s)", c):
        return "Instalar paquetes de Python desde fuentes no oficiales está bloqueado."
    if re.search(r"\b(npm|pnpm|yarn)\s+(i|install|add)\b.*(https?://|git\+|github:)", c):
        return "Instalar paquetes de npm desde URLs está bloqueado."
    return None


def main():
    try:
        datos = json.load(sys.stdin)
    except json.JSONDecodeError:
        return
    herramienta, entrada = datos.get("tool_name", ""), datos.get("tool_input") or {}
    motivo = None
    if herramienta == "Bash":
        motivo = revisar_bash(entrada.get("command", ""))
    elif herramienta == "WebFetch":
        url = entrada.get("url", "")
        motivo = (f"Sitio bloqueado por seguridad: {d}." if (d := bloqueado(url)) else None)
        registrar("webfetch", url)
    elif herramienta == "WebSearch":
        registrar("busqueda", entrada.get("query", ""))
    if motivo:
        registrar("BLOQUEADO", f"{herramienta}: {motivo}")
        print(json.dumps({"hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "deny",
            "permissionDecisionReason": f"Guardián: {motivo}",
        }}, ensure_ascii=False))


if __name__ == "__main__":
    main()
