from urllib.parse import urlparse

from flask import Flask, redirect, render_template, request, url_for

from translations import get_strings

app = Flask(__name__)

COOKIE_LANG = "site_lang"
COOKIE_MAX_AGE = 60 * 60 * 24 * 365


def current_lang():
    code = request.cookies.get(COOKIE_LANG, "en")
    return code if code in ("en", "ar") else "en"


def safe_redirect_target():
    ref = request.referrer
    if not ref:
        return url_for("index")
    cur = urlparse(request.host_url)
    back = urlparse(ref)
    if back.netloc == cur.netloc:
        return ref
    return url_for("index")


@app.route("/set-language/<lang>")
def set_language(lang):
    """Query param name must match url_for(..., lang='en') in templates."""
    code = "en" if lang not in ("en", "ar") else lang
    resp = redirect(safe_redirect_target())
    resp.set_cookie(COOKIE_LANG, code, max_age=COOKIE_MAX_AGE, samesite="Lax", path="/")
    return resp


@app.route("/")
def index():
    lang = current_lang()
    t, lang = get_strings(lang)
    return render_template("index.html", t=t, lang=lang)


if __name__ == "__main__":
    app.run(debug=True, port=5000)