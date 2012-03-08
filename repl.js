var lisp_repl_env;

function lisp_repl_onload() {
    lisp_repl_env = lisp_make_kernel_env();
    lisp_env_put_comfy(lisp_repl_env, "print", lisp_make_wrapped_native(lisp_repl_print, 1, 1));
    lisp_repl_load_file("standard.virtua");
    lisp_repl_load_file("test.virtua");
    lisp_repl_line().focus();
}

function lisp_repl_onsubmit() {
    try {
        var input = lisp_repl_line().value;
        lisp_repl_print(lisp_make_string("\u25B6 " + input));
        lisp_eval_forms(lisp_parse(input), true);
        lisp_repl_line().value = "";
    } catch(e) {
        lisp_repl_print(lisp_make_string("ERROR: " + e));
    } finally {
        return false;
    }
}

function lisp_eval_forms(forms, do_print) {
    for (var i = 0; i < forms.length; i++) {
        var form = forms[i];
        var result = lisp_eval(form, lisp_repl_env);
        if (do_print) {
            lisp_repl_print(result);
        }
    }
}

function lisp_repl_load_file(path) {
    lisp_repl_print(lisp_make_string("Loading " + path));
    var req = new XMLHttpRequest();
    // Append random thang to file path to bypass browser cache.
    req.open("GET", path + "?" + Math.random(), false);
    req.send(null);
    if(req.status == 200) {
        try {
            var forms = lisp_parse(req.responseText);
            var start = new Date().getTime();
            lisp_eval_forms(forms, false);
            var elapsed = new Date().getTime() - start;
            lisp_repl_print(lisp_make_string(elapsed + "ms"));
        } catch(e) {
            lisp_repl_print(lisp_make_string("ERROR: " + e));
        }
    } else {
        lisp_simple_error("XHR error: " + req.status);
    }
}

function lisp_repl_print(obj) {
    var s = lisp_string_native_string(lisp_to_string(obj));
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(s));
    var output = document.getElementById("lisp_output");
    output.appendChild(div);
    window.scrollTo(0, document.body.scrollHeight);
    return lisp_inert;
}

function lisp_repl_line() {
    return document.forms.lisp_input.line;
}
