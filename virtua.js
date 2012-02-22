// Virtua interpreter.
// Copyright (c) 2012 Manuel Simoni. See license at end of file.

/**** Kernel Environment ****/

function lisp_make_kernel_environment() {
    var env = lisp_make_environment();
    /* Basics */
    lisp_environment_put_comfy(env, "$vau", lisp_make_instance(Lisp_Vau));
    lisp_environment_put_comfy(env, "$define!", lisp_make_instance(Lisp_Define));
    lisp_environment_put_comfy(env, "$if", lisp_make_instance(Lisp_If));
    lisp_environment_put_comfy(env, "$loop", lisp_make_instance(Lisp_Loop));
    lisp_environment_put_comfy(env, "$unwind-protect", lisp_make_instance(Lisp_Unwind_Protect));
    lisp_environment_put_comfy(env, "$catch", lisp_make_instance(Lisp_Catch));
    lisp_environment_put_comfy(env, "throw", lisp_make_instance(Lisp_Throw));
    lisp_environment_put_comfy(env, "eq?", lisp_wrap_native(lisp_lib_eq, 2, 2));
    lisp_environment_put_comfy(env, "make-environment", lisp_wrap_native(lisp_make_environment, 0, 1));
    lisp_environment_put_comfy(env, "eval", lisp_wrap_native(lisp_eval, 2, 2));
    lisp_environment_put_comfy(env, "wrap", lisp_wrap_native(lisp_wrap, 1, 1));
    lisp_environment_put_comfy(env, "unwrap", lisp_wrap_native(lisp_unwrap, 1, 1));
    lisp_environment_put_comfy(env, "cons", lisp_wrap_native(lisp_cons, 2, 2));
    lisp_environment_put_comfy(env, "car", lisp_wrap_native(lisp_car, 1, 1));
    lisp_environment_put_comfy(env, "cdr", lisp_wrap_native(lisp_cdr, 1, 1));
    lisp_environment_put_comfy(env, "null?", lisp_wrap_native(lisp_lib_null, 1, 1));
    lisp_environment_put_comfy(env, "#t", lisp_t);
    lisp_environment_put_comfy(env, "#f", lisp_f);
    lisp_environment_put_comfy(env, "#ignore", lisp_ignore);
    lisp_environment_put_comfy(env, "#inert", lisp_inert);
    /* Objects */
    lisp_environment_put_comfy(env, "make-class", lisp_wrap_native(lisp_lib_make_class, 1, 1));
    lisp_environment_put_comfy(env, "make-instance", lisp_wrap_native(lisp_lib_make_instance, 1, 1));
    lisp_environment_put_comfy(env, "class-of", lisp_wrap_native(lisp_class_of, 1, 1));
    lisp_environment_put_comfy(env, "instance?", lisp_wrap_native(lisp_lib_is_instance, 2, 2));
    lisp_environment_put_comfy(env, "subclass?", lisp_wrap_native(lisp_lib_is_subclass, 2, 2));
    lisp_environment_put_comfy(env, "get-slot", lisp_wrap_native(lisp_lib_get_slot, 2, 2));
    lisp_environment_put_comfy(env, "has-slot?", lisp_wrap_native(lisp_lib_has_slot, 2, 2));
    lisp_environment_put_comfy(env, "set-slot!", lisp_wrap_native(lisp_lib_set_slot, 3, 3));
    /* Classes */
    lisp_environment_put_comfy(env, "Object", Lisp_Object);
    lisp_environment_put_comfy(env, "Class", Lisp_Class);
    lisp_environment_put_comfy(env, "Environment", Lisp_Environment);
    lisp_environment_put_comfy(env, "Symbol", Lisp_Symbol);
    lisp_environment_put_comfy(env, "Pair", Lisp_Pair);
    lisp_environment_put_comfy(env, "Nil", Lisp_Nil);
    lisp_environment_put_comfy(env, "String", Lisp_String);
    lisp_environment_put_comfy(env, "Number", Lisp_Number);
    lisp_environment_put_comfy(env, "Boolean", Lisp_Boolean);
    lisp_environment_put_comfy(env, "Ignore", Lisp_Ignore);
    lisp_environment_put_comfy(env, "Inert", Lisp_Inert);
    lisp_environment_put_comfy(env, "Combiner", Lisp_Combiner);
    lisp_environment_put_comfy(env, "Compound-Combiner", Lisp_Compound_Combiner);
    lisp_environment_put_comfy(env, "Wrapper", Lisp_Wrapper);
    lisp_environment_put_comfy(env, "Native-Combiner", Lisp_Native_Combiner);
    /* Misc */
    lisp_environment_put_comfy(env, "error", lisp_wrap_native(lisp_lib_error, 1, 1));
    return env;
};

/**** Core Behaviors ****/

/* Evaluates the object in the environment. */
function lisp_eval(obj, env) {
    return lisp_class_of(obj).lisp_eval(obj, env);
}

/* Combines the object with the operand tree in the environment. */
function lisp_combine(obj, otree, env) {
    return lisp_class_of(obj).lisp_combine(obj, otree, env);
}

/* Matches this object against the operand tree, possibly updating the environment. */
function lisp_match(obj, otree, env) {
    return lisp_class_of(obj).lisp_match(obj, otree, env);
}

/* Sends a message with the given selector and operand tree to this object. */
function lisp_send(obj, sel, otree) {
    return lisp_class_of(obj).lisp_send(obj, sel, otree);
}

/**** Object System ****/

function Lisp_Object_Prototype() {}

Lisp_Object_Prototype.prototype.lisp_eval = function(obj, env) {
    return obj;
};

Lisp_Object_Prototype.prototype.lisp_combine = function(obj, otree, env) {
    lisp_simple_error("Not a combiner.");
};

Lisp_Object_Prototype.prototype.lisp_match = function(obj, otree, env) {
    lisp_simple_error("Not a pattern.");
};

Lisp_Object_Prototype.prototype.lisp_send = function(obj, sel, otree) {
    var c = lisp_class_of(obj);
    var method = c[sel];
    if (typeof(method) !== "undefined") {
        return lisp_combine(method, lisp_cons(obj, otree), lisp_make_environment());
    } else {
        lisp_message_not_understood_error(obj, sel);
    }
};

/* Bootstrap the class hierarchy. */

/* The root of the class hierarchy. */
var Lisp_Object = new Lisp_Object_Prototype();

/* The class of classes. */
function Lisp_Class_Prototype() {}
Lisp_Class_Prototype.prototype = Lisp_Object;
var Lisp_Class = new Lisp_Class_Prototype();

Lisp_Object.lisp_isa = Lisp_Class;
Lisp_Class.lisp_isa = Lisp_Class;
Lisp_Class.lisp_superclass = Lisp_Object;

/* Creates a new class with the given superclass and native name (for debuggability). */
function lisp_make_class(sc, native_name) {
    lisp_assert(lisp_is_instance(sc, Lisp_Class));
    lisp_assert(lisp_is_native_string(native_name));
    var f = eval("(function " + native_name + "() {})");
    f.prototype = sc;
    var c = new f();
    c.lisp_isa = Lisp_Class;
    c.lisp_superclass = sc;
    return c;
}

/* Creates an instance of the given class. */
function lisp_make_instance(c) {
    lisp_assert(lisp_is_instance(c, Lisp_Class));
    return { lisp_isa: c };
}

/* Returns the class of the object. */
function lisp_class_of(obj) {
    if (typeof(obj) === "undefined") {
        lisp_not_an_object_error(obj);
    }
    var c = obj.lisp_isa;
    if (typeof(c) !== "undefined") {
        return c;
    } else {
        lisp_not_an_object_error(obj);
    }
}

/* Returns true if the object is a direct or general instance of the class. */
function lisp_is_instance(obj, c) {
    return lisp_is_subclass(lisp_class_of(obj), c);
}

/* Returns true if the class is a direct or general subclass of the superclass. */
function lisp_is_subclass(c, sc) {
    if (c === sc) {
        return true;
    } else {
        var csc = lisp_superclass_of(c);
        if (typeof(csc) !== "undefined") {
            return lisp_is_subclass(csc, sc);
        } else {
            return false;
        }
    }
}

/* Returns the superclass of a class, or undefined for the root class. */
function lisp_superclass_of(c) {
    return c.lisp_superclass;
}

function lisp_not_an_object_error(obj) {
    lisp_simple_error("Not an object.");
}

function lisp_message_not_understood_error(obj, sel) {
    lisp_simple_error("Message not understood.");
}

/* Puts a combiner as implementation for a message selector. */
function lisp_put_method(c, sel, cmb) {
    lisp_assert(lisp_is_instance(c, Lisp_Class));
    lisp_assert(lisp_is_native_string(sel));
    lisp_assert(lisp_is_instance(cmb, Lisp_Object));
    c[sel] = cmb;
    return lisp_inert;
}

/* Puts a native function as implementation for a message selector. */
function lisp_put_native_method(c, sel, native_fun) {
    return lisp_put_method(c, sel, lisp_wrap_native(native_fun));
}

/**** Strings ****/

var Lisp_String = lisp_make_class(Lisp_Object, "Lisp_String");

/* Creates a new string with the given native string. */
function lisp_make_string(native_string) {
    lisp_assert(lisp_is_native_string(native_string));
    var string = lisp_make_instance(Lisp_String);
    string.lisp_native_string = native_string;
    return string;
}

/* Returns the native string of the string. */
function lisp_string_native_string(string) {
    lisp_assert(lisp_is_instance(string, Lisp_String));
    return string.lisp_native_string;
}

function lisp_is_native_string(native_string) {
    return typeof(native_string.substring) !== "undefined";
}

/**** Numbers ****/

var Lisp_Number = lisp_make_class(Lisp_Object, "Lisp_Number");

/* Creates a new number from the given native string number
   representation. */
function lisp_make_number(repr) {
    lisp_assert(lisp_is_native_string(repr));
    var number = lisp_make_instance(Lisp_Number);
    number.lisp_number = jsnums.fromString(repr);;
    return number;
}

/**** Symbols ****/

var lisp_symbols_table = {};

var Lisp_Symbol = lisp_make_class(Lisp_Object, "Lisp_Symbol");

/* A symbol evaluates to the value of the binding it names. */
Lisp_Symbol.lisp_eval = function(symbol, env) {
    return lisp_environment_lookup(env, symbol);
};

/* A symbol matches anything and binds the operand in the environment. */
Lisp_Symbol.lisp_match = function(symbol, otree, env) {
    lisp_environment_put(env, symbol, otree);
};

/* Use lisp_intern. */
function lisp_make_symbol_do_not_call(name) {
    lisp_assert(lisp_is_instance(name, Lisp_String));
    var symbol = lisp_make_instance(Lisp_Symbol);
    symbol.lisp_name = name;
    return symbol;
}

/* Returns the symbol with the given name. */
function lisp_intern(name) {
    var native_string = lisp_string_native_string(name);
    var symbol = lisp_symbols_table[native_string];
    if (typeof(symbol) !== "undefined") {
        return symbol;
    } else {
        symbol = lisp_make_symbol_do_not_call(name);
        lisp_symbols_table[native_string] = symbol;
        return symbol;
    }
}

/* Returns the symbol with the given native string name. */
function lisp_intern_comfy(native_string) {
    return lisp_intern(lisp_make_string(native_string));
}

/* Returns the string name of a symbol. */
function lisp_symbol_name(symbol) {
    lisp_assert(lisp_is_instance(symbol, Lisp_Symbol));
    return symbol.lisp_name;
}

/* Returns the native string name of a symbol. */
function lisp_symbol_native_string(symbol) {
    return lisp_string_native_string(lisp_symbol_name(symbol));
}

/**** Pairs ****/

var Lisp_Pair = lisp_make_class(Lisp_Object, "Lisp_Pair");

/* A pair evaluates to the combination of its operator (car) with its
   operand tree (cdr). */
Lisp_Pair.lisp_eval = function(pair, env) {
    return lisp_combine(lisp_eval(lisp_car(pair), env), lisp_cdr(pair), env);
};

/* A pair matches pairs, recursively. */
Lisp_Pair.lisp_match = function(pair, otree, env) {
    lisp_assert(lisp_is_instance(otree, Lisp_Pair));
    lisp_match(lisp_car(pair), lisp_car(otree), env);
    lisp_match(lisp_cdr(pair), lisp_cdr(otree), env);
};

/* Creates a new pair with the given first and second elements. */
function lisp_cons(car, cdr) {
    lisp_assert(lisp_is_instance(car, Lisp_Object));
    lisp_assert(lisp_is_instance(cdr, Lisp_Object));
    var cons = lisp_make_instance(Lisp_Pair);
    cons.lisp_car = car;
    cons.lisp_cdr = cdr;
    return cons;
}

/* Returns the first element of the pair. */
function lisp_car(cons) {
    lisp_assert(lisp_is_instance(cons, Lisp_Pair));
    return cons.lisp_car;
}

/* Returns the second element of the pair. */
function lisp_cdr(cons) {
    lisp_assert(lisp_is_instance(cons, Lisp_Pair));
    return cons.lisp_cdr;
}

function lisp_elt(pair, i) {
    if (i === 0) {
        return lisp_car(pair);
    } else {
        return lisp_elt(lisp_cdr(pair), i - 1);
    }
}

function lisp_array_to_cons_list(array, end) {
    var c = end ? end : lisp_nil;
    for (var i = array.length; i > 0; i--)
        c = lisp_cons(array[i - 1], c);
    return c;
}

function lisp_cons_list_to_array(c) {
    var res = [];
    while(c !== lisp_nil) {
        res.push(lisp_car(c));
        c = lisp_cdr(c);
    }
    return res;
}

/**** Environments ****/

var Lisp_Environment = lisp_make_class(Lisp_Object, "Lisp_Environment");

/* Creates a new empty environment with an optional parent environment. */
function lisp_make_environment(parent) {
    if (typeof(parent) !== "undefined") {
        lisp_assert(lisp_is_instance(parent, Lisp_Environment));
        function E() {};
        E.prototype = parent.lisp_bindings;
        return lisp_make_environment_with_bindings(new E());
    } else {
        return lisp_make_environment_with_bindings({});        
    }
}

function lisp_make_environment_with_bindings(bindings) {
    var env = lisp_make_instance(Lisp_Environment);
    env.lisp_bindings = bindings;
    return env;
}

/* Updates or creates a binding from a name to a value. */
function lisp_environment_put(env, name, value) {
    lisp_assert(lisp_is_instance(env, Lisp_Environment));
    lisp_assert(lisp_is_instance(name, Lisp_Symbol));
    lisp_assert(lisp_is_instance(value, Lisp_Object));
    env.lisp_bindings[lisp_symbol_native_string(name)] = value;
    return value;
}

/* Updates or creates a binding from a native string name to a value. */
function lisp_environment_put_comfy(env, native_string, value) {
    return lisp_environment_put(env, lisp_intern_comfy(native_string), value);
}

/* Looks up the value of a name in the environment and its ancestors. */
function lisp_environment_lookup(env, name) {
    lisp_assert(lisp_is_instance(env, Lisp_Environment));
    lisp_assert(lisp_is_instance(name, Lisp_Symbol));
    var native_name = lisp_symbol_native_string(name);
    var value = env.lisp_bindings[native_name];
    if (typeof(value) !== "undefined") {
        return value;
    } else {
        lisp_simple_error("Undefined identifier: " + native_name);
    }
}

/**** Booleans ****/

var Lisp_Boolean = lisp_make_class(Lisp_Object, "Lisp_Boolean");

var lisp_t = lisp_make_instance(Lisp_Boolean);

var lisp_f = lisp_make_instance(Lisp_Boolean);

/**** Nil ****/

var Lisp_Nil = lisp_make_class(Lisp_Object, "Lisp_Nil");

var lisp_nil = lisp_make_instance(Lisp_Nil);

/* Nil matches only itself. */
Lisp_Nil.lisp_match = function(nil, otree, env) {
    if (otree !== lisp_nil) {
        lisp_simple_error("Expected nil.");
    }
};

/**** Ignore ****/

var Lisp_Ignore = lisp_make_class(Lisp_Object, "Lisp_Ignore");

var lisp_ignore = lisp_make_instance(Lisp_Ignore);

/* Ignore matches anything. */
Lisp_Ignore.lisp_match = function(ignore, otree, env) {
};

/**** Inert ****/

var Lisp_Inert = lisp_make_class(Lisp_Object, "Lisp_Inert");

var lisp_inert = lisp_make_instance(Lisp_Inert);

/**** Combiners ****/

var Lisp_Combiner = lisp_make_class(Lisp_Object, "Lisp_Combiner");

/*** Compound Combiners ***/

/* Compound combiners are those created by $vau.  They contain a
   parameter tree, a formal lexical environment parameter, a body, and
   a static lexical environment link. */

var Lisp_Compound_Combiner = lisp_make_class(Lisp_Combiner, "Lisp_Compound_Combiner");

function lisp_make_combiner(ptree, envformal, body, senv) {
    lisp_assert(lisp_is_instance(ptree, Lisp_Object));
    lisp_assert(lisp_is_instance(envformal, Lisp_Object));
    lisp_assert(lisp_is_instance(body, Lisp_Object));
    lisp_assert(lisp_is_instance(senv, Lisp_Environment));
    var cmb = lisp_make_instance(Lisp_Compound_Combiner);
    cmb.lisp_ptree = ptree;
    cmb.lisp_envformal = envformal;
    cmb.lisp_body = body;
    cmb.lisp_senv = senv;
    return cmb;
}

Lisp_Compound_Combiner.lisp_combine = function(cmb, otree, env) {
    // Match parameter tree against operand tree in new child
    // environment of static environment
    var xenv = lisp_make_environment(cmb.lisp_senv);
    lisp_match(cmb.lisp_ptree, otree, xenv);
    // Pass in dynamic environment unless ignored
    lisp_match(cmb.lisp_envformal, env, xenv);
    // Enter body in extended environment
    return lisp_eval(cmb.lisp_body, xenv);
};

/*** Wrappers ***/

/* A wrapper (applicative combiner) induces argument evaluation for an
   underlying combiner.  What this means is that the operand tree must
   be a list, and all elements are evaluated to yield an arguments
   list, which is passed to the underlying combiner. */

var Lisp_Wrapper = lisp_make_class(Lisp_Combiner, "Lisp_Wrapper");

/* Creates a new wrapper around an underlying combiner. */
function lisp_wrap(underlying) {
    lisp_assert(lisp_is_instance(underlying, Lisp_Combiner));
    var cmb = lisp_make_instance(Lisp_Wrapper);
    cmb.lisp_underlying = underlying;
    return cmb;
}

/* Extracts the underlying combiner of a wrapper. */
function lisp_unwrap(wrapper) {
    lisp_assert(lisp_is_instance(wrapper, Lisp_Wrapper));
    return wrapper.lisp_underlying;
}

Lisp_Wrapper.lisp_combine = function(cmb, otree, env) {
    return lisp_combine(lisp_unwrap(cmb), lisp_eval_args(otree, env), env);
};

function lisp_eval_args(otree, env) {
    if (otree === lisp_nil) {
        return lisp_nil;
    } else {
        return lisp_cons(lisp_eval(lisp_car(otree), env),
                         lisp_eval_args(lisp_cdr(otree), env));
    }
}

/*** $vau ***/

/* Creates a compound combiner.

   ($vau ptree envformal body) -> combiner */

var Lisp_Vau = lisp_make_class(Lisp_Combiner, "Lisp_Vau");

Lisp_Vau.lisp_combine = function(cmb, otree, env) {
    var ptree = lisp_elt(otree, 0);
    var envformal = lisp_elt(otree, 1);
    var body = lisp_elt(otree, 2);
    return lisp_make_combiner(ptree, envformal, body, env);
};

/*** $define! ***/

/* Updates the binding of a name to a value in the current
   environment.

   ($define! name value) -> value */

var Lisp_Define = lisp_make_class(Lisp_Combiner, "Lisp_Define");

Lisp_Define.lisp_combine = function(cmb, otree, env) {
    var name = lisp_elt(otree, 0);
    var value = lisp_elt(otree, 1);
    return lisp_environment_put(env, name, lisp_eval(value, env));
};

/*** $if ***/

/* Performs either the consequent or alternative expression, depending
   on the boolean result of the test expression.

   ($if test consequent alternative) -> result */

var Lisp_If = lisp_make_class(Lisp_Combiner, "Lisp_If");

Lisp_If.lisp_combine = function(cmb, otree, env) {
    var test = lisp_elt(otree, 0);
    var consequent = lisp_elt(otree, 1);
    var alternative = lisp_elt(otree, 2);
    var test_result = lisp_eval(test, env);
    if (test_result === lisp_t) {
        return lisp_eval(consequent, env);
    } else if (test_result === lisp_f) {
        return lisp_eval(alternative, env);
    } else {
        lisp_simple_error("Condition must be a boolean.");
    }
};

/*** $loop ***/

/* Repeatedly evaluates a body expression.

   ($loop body) -> | */

var Lisp_Loop = lisp_make_class(Lisp_Combiner, "Lisp_Loop");

Lisp_Loop.lisp_combine = function(cmb, otree, env) {
    var body = lisp_elt(otree, 0);
    while(true) {
        lisp_eval(body, env);
    }
};

/*** $unwind-protect ***/

/* Performs a cleanup expression whether or not a protected expression
   exits normally.  Returns the result of the protected expression.

   ($unwind-protect protected cleanup) -> result */

var Lisp_Unwind_Protect = lisp_make_class(Lisp_Combiner, "Lisp_Unwind_Protect");

Lisp_Unwind_Protect.lisp_combine = function(cmb, otree, env) {
    var protect = lisp_elt(otree, 0);
    var cleanup = lisp_elt(otree, 1);
    try {
        return lisp_eval(protect, env);
    } finally {
        lisp_eval(cleanup, env);
    }
};

/*** throw ***/

/* Throws a value to an enclosing catch tag.  If there is no such
   enclosing tag, an error happens (after the stack has been unwound
   -- unlike Common Lisp.)

   (throw tag value) -> | */

var Lisp_Throw = lisp_make_class(Lisp_Combiner, "Lisp_Throw");

Lisp_Throw.lisp_combine = function(cmb, otree, env) {
    var tag = lisp_elt(otree, 0);
    var value = lisp_elt(otree, 1);
    throw new Lisp_Control_Exception(lisp_eval(tag, env),
                                     lisp_eval(value, env));
};

function Lisp_Control_Exception(tag, value) {
    this.lisp_tag = tag;
    this.lisp_value = value;
}

/*** $catch ***/

/* Performs a body with a catch tag in effect.  If a throw to that tag
   occurs during the dynamic extent of the evaluation of the body, the
   throw's value is returned, otherwise the result of the body is
   returned normally.

   ($catch tag body) -> result */

var Lisp_Catch = lisp_make_class(Lisp_Combiner, "Lisp_Catch");

Lisp_Catch.lisp_combine = function(cmb, otree, env) {
    var tag = lisp_elt(otree, 0);
    var body = lisp_elt(otree, 1);
    var tag_value = lisp_eval(tag, env);
    try {
        return lisp_eval(body, env);
    } catch(e) {
        if (e.lisp_tag === tag_value) {
            return e.lisp_value;
        } else {
            throw e;
        }
    }
};

/**** Native Combiners ****/

/* A native combiner contains a native function. */

var Lisp_Native_Combiner = lisp_make_class(Lisp_Combiner, "Lisp_Native_Combiner");

Lisp_Native_Combiner.lisp_combine = function(cmb, otree, env) {
    var args = lisp_cons_list_to_array(otree);
    if (typeof(cmb.lisp_min_args !== "undefined")) {
        if (args.length < cmb.lisp_min_args) {
            lisp_simple_error("Too few arguments.");
        }
    }
    if (typeof(cmb.lisp_max_args !== "undefined")) {
        if (args.length > cmb.lisp_max_args) {
            lisp_simple_error("Too many arguments.");
        }
    }
    return cmb.lisp_native_fun.apply(null, args);
};

/* Creates a new native combiner for the native function. */
function lisp_make_native(native_fun, min_args, max_args) {
    var cmb = lisp_make_instance(Lisp_Native_Combiner);
    cmb.lisp_native_fun = native_fun;
    cmb.lisp_min_args = min_args;
    cmb.lisp_max_args = max_args;
    return cmb;
}

/* Creates a new native wrapper for the native function. */
function lisp_wrap_native(native_fun, min_args, max_args) {
    return lisp_wrap(lisp_make_native(native_fun, min_args, max_args));
}

/**** Library ****/

/*** Helpers ***/

/* Returns a Lisp boolean for a native one. */
function lisp_truth(native_bool) {
    return native_bool ? lisp_t : lisp_f;
}

/* Returns a native boolean for a Lisp one. */
function lisp_native_truth(lisp_bool) {
    lisp_assert(lisp_is_instance(lisp_bool, Lisp_Boolean));
    return lisp_bool === lisp_t ? true : false;
}

/*** Library Functions ***/

function lisp_lib_eq(a, b) {
    return lisp_truth(a === b);
}

function lisp_lib_null(obj) {
    return lisp_lib_eq(obj, lisp_nil);
}

function lisp_lib_make_class(sc) {
    return lisp_make_class(sc, "Lisp_UFO");
}

function lisp_lib_make_instance(c) {
    return lisp_make_instance(c);
}

function lisp_lib_is_instance(obj, c) {
    return lisp_truth(lisp_is_instance(obj, c));
}

function lisp_lib_is_subclass(c, sc) {
    return lisp_truth(lisp_is_subclass(c, sc));
}

function lisp_lib_get_slot(obj, slot) {
    lisp_assert(lisp_is_instance(obj, Lisp_Object));
    lisp_assert(lisp_is_instance(slot, Lisp_Symbol));
    var value = obj[lisp_symbol_native_string(slot)];
    if (typeof(value) !== "undefined") {
        return value;
    } else {
        lisp_simple_error("Unbound slot.");
    }
}

function lisp_lib_has_slot(obj, slot) {
    lisp_assert(lisp_is_instance(obj, Lisp_Object));
    lisp_assert(lisp_is_instance(slot, Lisp_Symbol));
    var value = obj[lisp_symbol_native_string(slot)];
    return (typeof(value) !== "undefined");
}

function lisp_lib_set_slot(obj, slot, value) {
    lisp_assert(lisp_is_instance(obj, Lisp_Object));
    lisp_assert(lisp_is_instance(slot, Lisp_Symbol));
    lisp_assert(lisp_is_instance(value, Lisp_Object));
    obj[lisp_symbol_native_string(slot)] = value;
    return value;
}

function lisp_lib_error(string) {
    lisp_assert(lisp_is_instance(string, Lisp_String));
    lisp_simple_error(lisp_string_native_string(string));
}

/*** Printing ***/

function lisp_to_string(obj) {
    return lisp_send(obj, "to-string", lisp_nil);
}

lisp_put_native_method(Lisp_Object, "to-string", function(obj) {
    return lisp_make_string("#[object]");
});

lisp_put_native_method(Lisp_Class, "to-string", function(obj) {
    return lisp_make_string("#[class]");
});

lisp_put_native_method(Lisp_String, "to-string", function(obj) {
    return obj;
});

lisp_put_native_method(Lisp_Number, "to-string", function(obj) {
    return lisp_make_string(obj.lisp_number.toString());
});

lisp_put_native_method(Lisp_Boolean, "to-string", function(obj) {
    return obj === lisp_t ? lisp_make_string("#t") : lisp_make_string("#f");
});

// Have to use non-wrapped natives for pairs or symbols or we get an
// extra-evaluation.  Need to look into how to handle this more
// elegantly.

lisp_put_method(Lisp_Pair, "to-string", lisp_make_native(function(obj) {
    var car_string = lisp_string_native_string(lisp_to_string(lisp_car(obj)));
    var cdr_string = lisp_string_native_string(lisp_to_string(lisp_cdr(obj)));
    return lisp_make_string("(" + car_string + " . " + cdr_string + ")");
}));

lisp_put_method(Lisp_Symbol, "to-string", lisp_make_native(function(obj) {
    return lisp_symbol_name(obj);
}));

lisp_put_native_method(Lisp_Nil, "to-string", function(obj) {
    return lisp_make_string("()");
});

lisp_put_native_method(Lisp_Ignore, "to-string", function(obj) {
    return lisp_make_string("#ignore");
});

lisp_put_native_method(Lisp_Inert, "to-string", function(obj) {
    return lisp_make_string("#inert");
});

lisp_put_native_method(Lisp_Combiner, "to-string", function(obj) {
    return lisp_make_string("#[combiner]");
});

/**** Errors & Assertions ****/

function lisp_simple_error(msg) {
    throw msg;
}

function lisp_assert(bool) {
    if (!bool) {
        lisp_simple_error("Assertion failed.");
    }
}

/**** Parser ****/

/* Returns an array of cons lists of the forms in the string. */
function lisp_parse(string) {
    lisp_assert(lisp_is_native_string(string));
    var result = lisp_program_syntax(ps(string));
    if (result.ast) {
        return result.ast;
    } else {
        lisp_simple_error("Parse error.");
    }
}

var lisp_expression_syntax =
    function(input) { return lisp_expression_syntax(input); }; // forward decl.

var lisp_identifier_special_char =
    choice(// R5RS sans "."
           "-", "&", "!", ":", "=", ">","<", "%", "+", "?", "/", "*", "#",
           // Additional
           "$", "_");

var lisp_identifier_syntax =
    action(join_action(repeat1(choice(range("a", "z"),
                                      range("A", "Z"),
                                      range("0", "9"),
                                      lisp_identifier_special_char)),
                       ""),
           lisp_identifier_syntax_action);

function lisp_identifier_syntax_action(ast) {
    return lisp_intern_comfy(ast);
}

var lisp_escape_char =
    choice("\"", "\\");

var lisp_escape_sequence =
    action(sequence("\\", lisp_escape_char),
           lisp_escape_sequence_action);

var lisp_string_char =
    choice(negate(lisp_escape_char),
           lisp_escape_sequence);

var lisp_string_syntax =
    action(sequence("\"", join_action(repeat0(lisp_string_char), ""), "\""),
           lisp_string_syntax_action);

function lisp_escape_sequence_action(ast) {
    var escape_char = ast[1];
    return escape_char;
}

function lisp_string_syntax_action(ast) {
    return lisp_make_string(ast[1]);
}

var lisp_digits = 
    join_action(repeat1(range("0", "9")), "");

var lisp_number_syntax =
    action(sequence(optional(choice("+", "-")),
                    lisp_digits,
                    optional(join_action(sequence(".", lisp_digits), ""))),
           lisp_number_syntax_action);

function lisp_number_syntax_action(ast) {    
    var sign = ast[0] ? ast[0] : "+";
    var integral_digits = ast[1];
    var fractional_digits = ast[2] || "";
    return lisp_make_number(sign + integral_digits + fractional_digits);
}

var lisp_nil_syntax =
    action("()", lisp_nil_syntax_action);

function lisp_nil_syntax_action(ast) {
    return lisp_nil;
}

var lisp_ignore_syntax =
    action("#ignore", lisp_ignore_syntax_action);

function lisp_ignore_syntax_action(ast) {
    return lisp_ignore;
}

var lisp_inert_syntax =
    action("#inert", lisp_inert_syntax_action);

function lisp_inert_syntax_action(ast) {
    return lisp_inert;
}

var lisp_dot_syntax =
    action(wsequence(".", lisp_expression_syntax),
           lisp_dot_syntax_action);

function lisp_dot_syntax_action(ast) {
    return ast[1];
}

var lisp_compound_syntax =
    action(wsequence("(",
                     repeat1(lisp_expression_syntax),
                     optional(lisp_dot_syntax),
                     ")"),
           lisp_compound_syntax_action);

function lisp_compound_syntax_action(ast) {
    var exprs = ast[1];
    var end = ast[2] ? ast[2] : lisp_nil;
    return lisp_array_to_cons_list(exprs, end);
}

var lisp_line_terminator = choice(ch("\r"), ch("\n"));

var lisp_line_comment_syntax =
    action(sequence(";",
                    repeat0(negate(lisp_line_terminator)),
                    optional(lisp_line_terminator)),
           lisp_line_comment_action);

function lisp_line_comment_action(ast) {
    return lisp_inert;
}

var lisp_expression_syntax =
    whitespace(choice(lisp_number_syntax,
                      lisp_nil_syntax,
                      lisp_ignore_syntax,
                      lisp_inert_syntax,
                      lisp_compound_syntax,
                      lisp_identifier_syntax,
                      lisp_string_syntax,
                      lisp_line_comment_syntax));

var lisp_program_syntax =
    whitespace(repeat1(lisp_expression_syntax));


// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without
// restriction, including without limitation the rights to use, copy,
// modify, merge, publish, distribute, sublicense, and/or sell copies
// of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. ALSO, THERE IS NO KERNEL UNDERGROUND; IT'S ALL
// JUST RUMOUR AND HEARSAY. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.
