/**** Core Environment ****/

function virtua_make_core_env() {
    var env = virtua_make_env();
    virtua_env_bind_comfortably(env, "def", new Virtua_def());
    virtua_env_bind_comfortably(env, "vau", new Virtua_vau());
    virtua_env_bind_comfortably(env, "loop", new Virtua_loop());
    virtua_env_bind_comfortably(env, "unwind-protect", new Virtua_unwind_protect());
    virtua_env_bind_comfortably(env, "throw", new Virtua_throw());
    virtua_env_bind_comfortably(env, "catch", new Virtua_catch());
    virtua_env_bind_comfortably(env, "make-environment", virtua_make_alien(virtua_make_env));
    virtua_env_bind_comfortably(env, "eval", virtua_make_alien(virtua_eval));
    virtua_env_bind_comfortably(env, "wrap", virtua_make_alien(virtua_wrap));
    virtua_env_bind_comfortably(env, "unwrap", virtua_make_alien(virtua_unwrap));
    virtua_env_bind_comfortably(env, "cons", virtua_make_alien(virtua_cons));
    virtua_env_bind_comfortably(env, "car", virtua_make_alien(virtua_car));
    virtua_env_bind_comfortably(env, "cdr", virtua_make_alien(virtua_cdr));
    virtua_env_bind_comfortably(env, "#nil", virtua_nil);
    virtua_env_bind_comfortably(env, "#ignore", virtua_ignore);
    virtua_env_bind_comfortably(env, "#void", virtua_void);
    return env;
}

/**** Messaging ****/

/* Like in Smalltalk, objects respond to messages.  The object to
   which a message is sent is called the receiver (rcv).  The name of
   the message is called the selector (sel) and must be a symbol.  A
   message send passes along a single argument object (arg) that is
   not inspected by the messaging system.
  
   Sending a message is effected with "virtua_send", which dispatches
   to the receiver's "virtua_send" property, allowing every object to
   implement its own message handling functionality. */

function virtua_send(rcv, sel, arg) {
    return rcv.virtua_send(rcv, sel, arg);
}

/**** Default Objects ****/

/* Default objects peruse JS's prototype chain to implement mapping of
   message selectors to implementation functions (methods).  A method
   receives as its two arguments the receiver and the opaque argument
   object. */

function Virtua_obj() {
}

Virtua_obj.prototype.virtua_send = function(rcv, sel, arg) {
    var method_name = virtua_str_get_js_str(virtua_sym_get_name(sel));
    var method = rcv[method_name];
    if (method !== undefined) {
        return method(rcv, arg);
    } else {
        // TODO: implement message-not-understood handling.
        throw("message not understood:" + method_name);
    }
}

/**** Strings ****/

/* Strings store a JavaScript string as a member, as a cordon
   sanitaire. */

function Virtua_str(js_str) {
    this.js_str = js_str;
}

Virtua_str.prototype = new Virtua_obj();

/* Creates a new string from the given JS string. */
function virtua_str(js_str) {
    return new Virtua_str(js_str);
}

/* Returns the JS string of a string. */
function virtua_str_get_js_str(str) {
    return str.js_str;
}

/**** Symbols ****/

/* Symbols are unique names that can be compared via pointer
   equality. */

var virtua_syms = {};

function Virtua_sym(name) {
    this.virtua_name = name;
}

Virtua_sym.prototype = new Virtua_obj();

/* Returns the symbol with the given string name. */
function virtua_intern(name) {
    var js_str = virtua_str_get_js_str(name);
    var sym = virtua_syms[js_str];
    if (sym !== undefined) {
        return sym;
    } else {
        sym = new Virtua_sym(name);
        virtua_syms[js_str] = sym;
        return sym;
    }
}

/* Returns the name string of a symbol. */
function virtua_sym_get_name(sym) {
    return sym.virtua_name;
}

Virtua_sym.prototype["symbol-name"] = virtua_sym_get_name;

/**** Pairs ****/

function Virtua_pair(car, cdr) {
    this.virtua_car = car;
    this.virtua_cdr = cdr;
}

Virtua_pair.prototype = new Virtua_obj();

/* Creates a new pair with the given car and cdr. */
function virtua_cons(car, cdr) {
    return new Virtua_pair(car, cdr);
}

/* Returns the car of a pair. */
function virtua_car(pair) {
    return pair.virtua_car;
}

/* Returns the cdr of a pair. */
function virtua_cdr(pair) {
    return pair.virtua_cdr;
}

Virtua_pair.prototype["car"] = virtua_car;
Virtua_pair.prototype["cdr"] = virtua_cdr;

function virtua_elt(pair, i) {
    if (i === 0) {
        return virtua_car(pair);
    } else {
        return virtua_elt(virtua_cdr(pair), i - 1);
    }
}

function virtua_array_to_cons_list(array, end) {
    var c = end ? end : virtua_nil;
    for (var i = array.length; i > 0; i--)
        c = virtua_cons(array[i - 1], c);
    return c;
}

/**** Nil ****/

/* Nil is the empty list, and different from void. */

function Virtua_nil() {
}

Virtua_nil.prototype = new Virtua_obj();

var virtua_nil = new Virtua_nil();

/**** Void ****/

/* Void is the uninteresting value, returned by functions that do not
   compute a result. */

function Virtua_void() {
}

Virtua_void.prototype = new Virtua_obj();

var virtua_void = new Virtua_void();

/**** Ignore ****/

/* Ignore is used in pattern matching to indicate that one doesn't
   care about the actual value. */

function Virtua_ignore() {
}

Virtua_ignore.prototype = new Virtua_obj();

var virtua_ignore = new Virtua_ignore();

/**** Pattern Matching ****/

/* Every object can participate in pattern matching as a
   left-hand-side pattern by responding to the 'match method.  It
   receives as argument a cons of the right-hand-side object to match
   against, and the environment in which matching should occur. */

function virtua_match(pattern, operand, env) {
    return virtua_send(pattern, virtua_intern(virtua_str("match")),
                       virtua_cons(operand, env));
}

/* By default, objects cannot be used as patterns. */
Virtua_obj.prototype["match"] = function(obj, arg) {
    // TODO: signal condition
    throw("Cannot use this object as pattern.");
};

/* Nil matches only itself. */
Virtua_nil.prototype["match"] = function(obj, arg) {
    var operand = virtua_car(arg);
    if (operand !== virtua_nil) {
        // TODO: signal condition
        throw("Expected nil.");
    }
};

/* Ignore matches anything. */
Virtua_ignore.prototype["match"] = function(obj, arg) {
    // do nothing
};

/* Symbols match anything and update the environment. */
Virtua_sym.prototype["match"] = function(obj, arg) {
    var operand = virtua_car(arg);
    var env = virtua_cdr(arg);
    virtua_env_bind(env, obj, operand);
};

/* Pairs match only pairs, recursively. */
Virtua_pair.prototype["match"] = function(obj, arg) {
    var operand = virtua_car(arg);
    var env = virtua_cdr(arg);
    virtua_match(virtua_car(obj), virtua_car(operand), env);
    virtua_match(virtua_cdr(obj), virtua_cdr(operand), env);
};

/**** Environments ****/

/* An environment is a mapping from names to values, and may have a
   parent environment, in which names are looked up if they are not
   bound in the environment itself. */

function Virtua_env(bindings) {
    this.virtua_bindings = bindings;
}

Virtua_env.prototype = new Virtua_obj();

/* Creates a new empty environment. */
function virtua_make_env() {
    return new Virtua_env({});
}

/* Creates a new empty environment with the given environment as
   parent. */
function virtua_env_extend(env) {
    function X() {};
    X.prototype = env.virtua_bindings;
    return new Virtua_env(new X());
}

/* Looks up the value of a symbol in the environment. */
function virtua_env_lookup(env, sym) {
    var var_name = virtua_str_get_js_str(virtua_sym_get_name(sym));
    var value = env.virtua_bindings[var_name];
    if (value !== undefined) {
        return value;
    } else {
        // TODO: signal condition
        throw("undefined variable: " + var_name);
    }
}

/* Updates the value of a symbol in the environment. */
function virtua_env_bind(env, sym, value) {
    var var_name = virtua_str_get_js_str(virtua_sym_get_name(sym));
    env.virtua_bindings[var_name] = value;
}

/* Updates the value of a JS string in the environment. */
function virtua_env_bind_comfortably(env, name, value) {
    virtua_env_bind(env, virtua_intern(virtua_str(name)), value);
}

/**** Evaluation ****/

/* Evaluates the object in the given environment.  The 'eval message
   is sent to the object with the environment as argument. */
function virtua_eval(obj, env) {
    return virtua_send(obj, virtua_intern(virtua_str("eval")), env);
}

/* By default, objects evaluate to themselves. */
Virtua_obj.prototype["eval"] = function(obj, env) {
    return obj;
};

/* Symbols evaluate to the value of the binding they name. */
Virtua_sym.prototype["eval"] = function(sym, env) {
    return virtua_env_lookup(env, sym);
};

/* Pairs evaluate to the combination of their operator (car) with the
   operand tree (cdr). */
Virtua_pair.prototype["eval"] = function(pair, env) {
    var combiner = virtua_eval(virtua_car(pair), env);
    return virtua_combine(combiner, virtua_cdr(pair), env);
};

/**** Combination ****/

/* Compute a result using the combiner and the operand tree in the
   given environment.  The 'combine message is sent to the combiner
   with a cons of the operand tree and environment as argument. */
function virtua_combine(combiner, otree, env) {
    return virtua_send(combiner, virtua_intern(virtua_str("combine")),
                       virtua_cons(otree, env));
}

/* By default, objects cannot act as combiner. */
Virtua_obj.prototype["combine"] = function(obj, arg) {
    // TODO: signal condition
    throw("Cannot use object as combiner.");
};

/*** Compound Combiner ***/

/* Compound combiners are those created by vau.  They contain a
   parameter tree, a formal lexical environment parameter, a body, and
   a static lexical environment link. */

function Virtua_combiner(ptree, eformal, body, env) {
    this.virtua_ptree = ptree;
    this.virtua_eformal = eformal;
    this.virtua_body = body;
    this.virtua_env = env;
}

Virtua_combiner.prototype = new Virtua_obj();

Virtua_combiner.prototype["combine"] = function(combiner, arg) {
    var otree = virtua_car(arg);
    var denv = virtua_cdr(arg);
    // Match parameter tree against operand tree in new child
    // environment of static environment
    var xenv = virtua_env_extend(combiner.virtua_env);
    virtua_match(combiner.virtua_ptree, otree, xenv);
    // Pass in dynamic environment unless ignored
    virtua_match(combiner.virtua_eformal, denv, xenv);
    // Enter body in extended environment
    return virtua_eval(combiner.virtua_body, xenv);
};

/*** Applicative Combiner ***/

/* An applicative combiner (wrapper) induces argument evaluation for
   an underlying combiner.  What this means is that the operand tree
   must be a list, and all elements are evaluated to yield an
   arguments list, which is passed to the underlying combiner. */

function Virtua_wrapper(underlying) {
    this.virtua_underlying = underlying;
}

Virtua_wrapper.prototype = new Virtua_obj();

/* Constructs a new wrapper around an underlying combiner. */
function virtua_wrap(underlying) {
    return new Virtua_wrapper(underlying);
}

/* Returns a wrapper's underlying combiner. */
function virtua_unwrap(wrapper) {
    return wrapper.virtua_underlying;
}

Virtua_wrapper.prototype["combine"] = function(appl, arg) {
    var otree = virtua_car(arg);
    var env = virtua_cdr(arg);
    return virtua_combine(appl.virtua_underlying, virtua_eval_args(otree, env), env);
};

function virtua_eval_args(otree, env) {
    if (otree === virtua_nil) {
        return virtua_nil;
    } else {
        return virtua_cons(virtua_eval(virtua_car(otree), env),
                           virtua_eval_args(virtua_cdr(otree), env));
    }
}

/*** Vau ***/

/* Vau creates a compound combiner.

   (vau ptree eformal body) -> combiner */

function Virtua_vau() {
}

Virtua_vau.prototype = new Virtua_obj();

Virtua_vau.prototype["combine"] = function(combiner, arg) {
    var otree = virtua_car(arg);
    var env = virtua_cdr(arg);
    var ptree = virtua_elt(otree, 0);
    var eformal = virtua_elt(otree, 1);
    var body = virtua_elt(otree, 2);
    return new Virtua_combiner(ptree, eformal, body, env);
};

/*** Def ***/

/* Def updates the binding of a name to a value in the current
   environment.

   (def name value) -> void */

function Virtua_def() {
}

Virtua_def.prototype = new Virtua_obj();

Virtua_def.prototype["combine"] = function(combiner, arg) {
    var otree = virtua_car(arg);
    var env = virtua_cdr(arg);
    var name = virtua_elt(otree, 0);
    var value = virtua_elt(otree, 1);
    virtua_env_bind(env, name, virtua_eval(value, env));
    return virtua_void;
};

/*** Loop ***/

/* Loop repeatedly evaluates a body expression.

   (loop body) -> | */

function Virtua_loop() {
}

Virtua_loop.prototype = new Virtua_obj();

Virtua_loop.prototype["combine"] = function(combiner, arg) {
    var otree = virtua_car(arg);
    var env = virtua_cdr(arg);
    var body = virtua_elt(otree, 0);
    while(true) {
        virtua_eval(body, env);
    }
};

/*** Unwind-Protect ***/

/* Unwind-Protect performs a cleanup expression whether or not a
   protected expression exits normally.  Returns the result of the
   protected expression.

   (unwind-protect protected cleanup) -> result */

function Virtua_unwind_protect() {
}

Virtua_unwind_protect.prototype = new Virtua_obj();

Virtua_unwind_protect.prototype["combine"] = function(combiner, arg) {
    var otree = virtua_car(arg);
    var env = virtua_cdr(arg);
    var protect = virtua_elt(otree, 0);
    var cleanup = virtua_elt(otree, 1);
    try {
        return virtua_eval(protect, env);
    } finally {
        virtua_eval(cleanup, env);
    }
};

/*** Throw ***/

/* Throw throws a value to an enclosing catch tag.  If there is no
   such enclosing tag, an error happens (after the stack has been
   unwound -- unlike Common Lisp.)

   (throw tag value) -> | */

function Virtua_throw() {
}

Virtua_throw.prototype = new Virtua_obj();

Virtua_throw.prototype["combine"] = function(combiner, arg) {
    var otree = virtua_car(arg);
    var env = virtua_cdr(arg);
    var tag = virtua_elt(otree, 0);
    var value = virtua_elt(otree, 1);
    throw new Virtua_control_exc(virtua_eval(tag, env),
                                 virtua_eval(value, env));
};

function Virtua_control_exc(tag, value) {
    this.virtua_tag = tag;
    this.virtua_value = value;
}

/*** Catch ***/

/* Catch performs a body with a catch tag in effect.  If a throw to
   that tag occurs during the dynamic extent of the evaluation of the
   body, the throw's value is returned, otherwise the result of the
   body is returned normally.

   (catch tag body) -> result */

function Virtua_catch() {
}

Virtua_catch.prototype = new Virtua_obj();

Virtua_catch.prototype["combine"] = function(combiner, arg) {
    var otree = virtua_car(arg);
    var env = virtua_cdr(arg);
    var tag = virtua_elt(otree, 0);
    var body = virtua_elt(otree, 1);
    var tagValue = virtua_eval(tag, env);
    try {
        return virtua_eval(body, env);
    } catch(e) {
        if (e.virtua_tag === tagValue) {
            return e.virtua_value;
        } else {
            throw e;
        }
    }
};

/**** Alien Combiners ****/

/* An alien combiner is a wrapper around a JS function. */

function Virtua_alien(js_fun) {
    this.js_fun = js_fun;
}

Virtua_alien.prototype = new Virtua_obj();

Virtua_alien.prototype["combine"] = function(combiner, arg) {
    var argslist = virtua_car(arg);
    return combiner.js_fun.apply(null, scm_cons_list_to_array(argslist));
};

function virtua_make_alien(js_fun) {
    return virtua_wrap(new Virtua_alien(js_fun));
}

/**** Parser ****/

/* Returns an array of cons lists of the forms in the string. */
function virtua_parse(string) {
    var result = virtua_program_syntax(ps(string));
    if (result.ast) {
        return result.ast;
    } else {
        // TODO: signal condition
        throw("Reader error:" + string);
    }
}

var virtua_expression_syntax =
    function(input) { return virtua_expression_syntax(input); }; // forward decl.

var virtua_identifier_special_char =
    choice(// R5RS sans "."
           "-", "&", "!", ":", "=", ">","<", "%", "+", "?", "/", "*", "#",
           // Additional
           "$", "_");

var virtua_identifier_syntax =
    action(join_action(repeat1(choice(range("a", "z"),
                                      range("0", "9"),
                                      virtua_identifier_special_char)),
                       ""),
           virtua_identifier_syntax_action);

function virtua_identifier_syntax_action(ast) {
    return virtua_intern(virtua_str(ast));
}

var virtua_escape_char =
    choice("\"", "\\");

var virtua_escape_sequence =
    action(sequence("\\", virtua_escape_char),
           virtua_escape_sequence_action);

var virtua_string_char =
    choice(negate(virtua_escape_char), 
           virtua_escape_sequence);

var virtua_string_syntax =
    action(sequence("\"", join_action(repeat0(virtua_string_char), ""), "\""),
           virtua_string_syntax_action);

function virtua_escape_sequence_action(ast) {
    var escape_char = ast[1];
    return escape_char;
}

function virtua_string_syntax_action(ast) {
    return virtua_str(ast[1]);
}

var virtua_nil_syntax =
    action("#nil", virtua_nil_syntax_action);

function virtua_nil_syntax_action(ast) {
    return virtua_nil;
}

var virtua_ignore_syntax =
    action("#ignore", virtua_ignore_syntax_action);

function virtua_ignore_syntax_action(ast) {
    return virtua_ignore;
}

var virtua_void_syntax =
    action("#void", virtua_void_syntax_action);

function virtua_void_syntax_action(ast) {
    return virtua_void;
}

var virtua_dot_syntax =
    action(wsequence(".", virtua_expression_syntax),
           virtua_dot_syntax_action);

function virtua_dot_syntax_action(ast) {
    return ast[1];
}

var virtua_compound_syntax =
    action(wsequence("(",
                     repeat1(virtua_expression_syntax),
                     optional(virtua_dot_syntax),
                     ")"),
           virtua_compound_syntax_action);

function virtua_compound_syntax_action(ast) {
    var exprs = ast[1];
    var end = ast[2] ? ast[2] : virtua_nil;
    return virtua_array_to_cons_list(exprs, end);
}

var virtua_expression_syntax =
    whitespace(choice(virtua_nil_syntax,
                      virtua_ignore_syntax,
                      virtua_void_syntax,
                      virtua_compound_syntax,
                      virtua_identifier_syntax,
                      virtua_string_syntax));

var virtua_program_syntax =
    whitespace(repeat1(virtua_expression_syntax));
