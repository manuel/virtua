// Virtua interpreter.
// Copyright (c) 2012 Manuel Simoni. See license at end of file.

/**** Kernel Environment ****/

function lisp_make_kernel_env() {
    var env = lisp_make_env(null);
    /* Basics */
    lisp_env_put_comfy(env, "$vau", lisp_make_instance(Lisp_Vau));
    lisp_env_put_comfy(env, "$begin", lisp_make_instance(Lisp_Begin));
    lisp_env_put_comfy(env, "$define!", lisp_make_instance(Lisp_Define));
    lisp_env_put_comfy(env, "$set!", lisp_make_instance(Lisp_Set));
    lisp_env_put_comfy(env, "$if", lisp_make_instance(Lisp_If));
    lisp_env_put_comfy(env, "$loop", lisp_make_instance(Lisp_Loop));
    lisp_env_put_comfy(env, "$unwind-protect", lisp_make_instance(Lisp_Unwind_Protect));
    lisp_env_put_comfy(env, "$catch", lisp_make_instance(Lisp_Catch));
    lisp_env_put_comfy(env, "throw", lisp_make_instance(Lisp_Throw));
    lisp_env_put_comfy(env, "eq?", lisp_make_wrapped_native(lisp_lib_eq, 2, 2));
    lisp_env_put_comfy(env, "make-environment", lisp_make_wrapped_native(lisp_lib_make_env, 0, 1));
    lisp_env_put_comfy(env, "eval", lisp_make_wrapped_native(lisp_eval, 2, 2));
    lisp_env_put_comfy(env, "wrap", lisp_make_wrapped_native(lisp_wrap, 1, 1));
    lisp_env_put_comfy(env, "unwrap", lisp_make_wrapped_native(lisp_unwrap, 1, 1));
    lisp_env_put_comfy(env, "cons", lisp_make_wrapped_native(lisp_cons, 2, 2));
    lisp_env_put_comfy(env, "car", lisp_make_wrapped_native(lisp_car, 1, 1));
    lisp_env_put_comfy(env, "cdr", lisp_make_wrapped_native(lisp_cdr, 1, 1));
    lisp_env_put_comfy(env, "null?", lisp_make_wrapped_native(lisp_lib_null, 1, 1));
    lisp_env_put_comfy(env, "#t", lisp_t);
    lisp_env_put_comfy(env, "#f", lisp_f);
    lisp_env_put_comfy(env, "#ignore", lisp_ignore);
    lisp_env_put_comfy(env, "#void", lisp_void);
    /* Objects */
    lisp_env_put_comfy(env, "make-class", lisp_make_wrapped_native(lisp_lib_make_class, 1, 1));
    lisp_env_put_comfy(env, "add-superclass!", lisp_make_wrapped_native(lisp_add_superclass, 2, 2));
    lisp_env_put_comfy(env, "make-instance", lisp_make_wrapped_native(lisp_lib_make_instance, 1, 1));
    lisp_env_put_comfy(env, "class-of", lisp_make_wrapped_native(lisp_class_of, 1, 1));
    lisp_env_put_comfy(env, "instance?", lisp_make_wrapped_native(lisp_lib_is_instance, 2, 2));
    lisp_env_put_comfy(env, "subclass?", lisp_make_wrapped_native(lisp_lib_is_subclass, 2, 2));
    lisp_env_put_comfy(env, "get-slot", lisp_make_wrapped_native(lisp_lib_get_slot, 2, 2));
    lisp_env_put_comfy(env, "has-slot?", lisp_make_wrapped_native(lisp_lib_has_slot, 2, 2));
    lisp_env_put_comfy(env, "set-slot!", lisp_make_wrapped_native(lisp_lib_set_slot, 3, 3));
    lisp_env_put_comfy(env, "put-method!", lisp_make_wrapped_native(lisp_lib_put_method, 3, 3));
    lisp_env_put_comfy(env, "send", lisp_make_wrapped_native(lisp_lib_send, 3, 3));
    lisp_env_put_comfy(env, "=", lisp_make_wrapped_native(lisp_equal, 2, 2));
    lisp_env_put_comfy(env, "to-string", lisp_make_wrapped_native(lisp_to_string, 1, 1));
    /* Classes */
    lisp_env_put_comfy(env, "Object", Lisp_Object);
    lisp_env_put_comfy(env, "Class", Lisp_Class);
    lisp_env_put_comfy(env, "Environment", Lisp_Env);
    lisp_env_put_comfy(env, "Symbol", Lisp_Symbol);
    lisp_env_put_comfy(env, "Pair", Lisp_Pair);
    lisp_env_put_comfy(env, "Nil", Lisp_Nil);
    lisp_env_put_comfy(env, "String", Lisp_String);
    lisp_env_put_comfy(env, "Number", Lisp_Number);
    lisp_env_put_comfy(env, "Boolean", Lisp_Boolean);
    lisp_env_put_comfy(env, "Ignore", Lisp_Ignore);
    lisp_env_put_comfy(env, "Void", Lisp_Void);
    lisp_env_put_comfy(env, "Combiner", Lisp_Combiner);
    lisp_env_put_comfy(env, "Compound-Combiner", Lisp_Compound_Combiner);
    lisp_env_put_comfy(env, "Wrapper", Lisp_Wrapper);
    lisp_env_put_comfy(env, "Native-Combiner", Lisp_Native_Combiner);
    /* Misc */
    lisp_env_put_comfy(env, "read-from-string", lisp_make_wrapped_native(lisp_read_from_string, 1, 1));
    lisp_env_put_comfy(env, "intern", lisp_make_wrapped_native(lisp_intern, 1, 1));
    lisp_env_put_comfy(env, "error", lisp_make_wrapped_native(lisp_lib_error, 1, 1));
    /* JS interop */
    lisp_env_put_comfy(env, "*window*", window);
    lisp_env_put_comfy(env, "js-global", lisp_make_wrapped_native(lisp_js_global, 1, 1));
    lisp_env_put_comfy(env, "set-js-global!", lisp_make_wrapped_native(lisp_set_js_global, 2, 2));
    lisp_env_put_comfy(env, "js-call", lisp_make_wrapped_native(lisp_js_call, 2));
    lisp_env_put_comfy(env, "js-function", lisp_make_wrapped_native(lisp_js_function, 1, 1));
    return env;
};

/**** Object System ****/

/*** Bootstrap ***/

Lisp_Object = Object.prototype;

function Lisp_Class_Prototype() {}
Lisp_Class_Prototype.prototype = Lisp_Object;
var Lisp_Class = new Lisp_Class_Prototype();

lisp_init_class(Lisp_Object, []);
lisp_init_class(Lisp_Class, [Lisp_Object]);

/*** Core Behaviors ***/

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

/* By default, objects evaluate to themselves. */
Lisp_Object.lisp_eval = function(obj, env) {
    return obj;
};

/* Make native functions callable. */
Lisp_Object.lisp_combine = function(obj, otree, env) {
    if (lisp_is_native_function(obj)) {
        var args = lisp_cons_list_to_array(lisp_eval_args(otree, env));
        return obj.apply(null, args);
    } else {
        lisp_simple_error("Not a combiner: " + lisp_string_native_string(lisp_to_string(cmb)));
    }
};

/* By default, objects cannot be used as left-hand side patterns. */
Lisp_Object.lisp_match = function(obj, otree, env) {
    lisp_simple_error("Not a pattern.");
};

/* All objects use the same method lookup algorithm. */
Lisp_Object.lisp_send = function(obj, sel, otree) {
    lisp_assert(lisp_is_instance(obj, Lisp_Object));
    lisp_assert(lisp_is_native_string(sel));
    lisp_assert(lisp_is_instance(otree, Lisp_Object));
    var c = lisp_class_of(obj);
    var method = lisp_lookup_method(c, sel);
    if (typeof(method) !== "undefined") {
        return lisp_combine(method, lisp_cons(obj, otree), lisp_make_env(null));
    } else {
        lisp_simple_error("Message not understood: " + sel + " by " + lisp_to_native_string(obj));
    }
};

function lisp_lookup_method(c, sel) {
    /* Temporary hack: simply disallow inheriting a method from more
       than one class.  Will be replaced by Touretzky's inferential
       distance ordering. */
    var method = c.lisp_methods[sel];
    if (typeof(method) !== "undefined") {
        return method;
    } else {
        var sups = lisp_superclasses_of(c);
        for (var i = 0; i < sups.length; i++) {
            var sup_method = lisp_lookup_method(sups[i], sel);
            if (typeof(method) !== "undefined") {
                lisp_simple_error("More than one method found: " + sel);
            } else {
                method = sup_method;
            }
        }
        return method;
    }
}

/*** Object System Functionality ***/

/* Creates a new class with the given prototype, superclasses and
   native name (for debuggability). */
function lisp_make_class(proto, sups, native_name) {
    lisp_assert(lisp_is_native_array(sups));
    lisp_assert(lisp_is_native_string(native_name));
    var f = eval("(function " + native_name + "() {})");
    f.prototype = proto;
    var c = new f();
    lisp_init_class(c, sups);
    return c;
}

function lisp_init_class(c, sups) {
    c.lisp_isa = c;
    c.lisp_superclasses = sups;
    c.lisp_methods = {};
}

/* System classes may use a different prototype than Object. */
function lisp_make_system_class(proto, native_name) {
    return lisp_make_class(proto, [proto], native_name);
}

/* User classes always have Object as prototype, regardless of what
   classes they inherit from. */
function lisp_make_user_class(sups, native_name) {
    lisp_assert(lisp_is_native_array(sups));
    if (sups.length === 0) {
        sups = [Lisp_Object];
    }
    return lisp_make_class(Lisp_Object, sups, native_name);
}

/* Creates an instance of the given class. */
function lisp_make_instance(c) {
    lisp_assert(lisp_is_instance(c, Lisp_Class));
    return Object.create(c);
}

/* Returns the class of the object. */
function lisp_class_of(obj) {
    if (typeof(obj) === "undefined") {
        return Lisp_Undefined;
    } else if (obj === null) {
        return Lisp_Void;
    } else {
        var c = obj.lisp_isa;
        if (c === undefined) {
            return Lisp_Object;
        } else if (c === obj) {
            return Lisp_Class;
        } else {
            return c;
        }
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
        var sups = lisp_superclasses_of(c);
        for (var i = 0; i < sups.length; i++) {
            if (lisp_is_subclass(sups[i], sc)) {
                return true;
            }
        }
        return false;
    }
}

/* Returns the superclasses of a class, which are empty for the root class. */
function lisp_superclasses_of(c) {
    var sups = c.lisp_superclasses;
    if (typeof(sups) !== "undefined") {
        return sups;
    } else {
        lisp_simple_error("Not a class.");
    }
}

/* Adds a superclass to a class. */
function lisp_add_superclass(c, sc) {
    lisp_assert(lisp_is_instance(c, Lisp_Class));
    lisp_assert(lisp_is_instance(sc, Lisp_Class));
    if (!lisp_native_array_contains(c.lisp_superclasses, sc)) {
        c.lisp_superclasses.push(sc);
    }
    return lisp_void;
}

/* Puts a combiner as implementation for a message selector. */
function lisp_put_method(c, sel, cmb) {
    lisp_assert(lisp_is_instance(c, Lisp_Class));
    lisp_assert(lisp_is_native_string(sel));
    lisp_assert(lisp_is_instance(cmb, Lisp_Combiner));
    c.lisp_methods[sel] = cmb;
}

/* Puts a wrapped native function as implementation for a message selector. */
function lisp_put_native_method(c, sel, native_fun) {
    lisp_put_method(c, sel, lisp_make_native(native_fun));
}

/**** JS Objects ****/

/* Returns global variable with given name. */
function lisp_js_global(name) {
    lisp_assert(lisp_is_instance(name, Lisp_String));
    return window[lisp_string_native_string(name)];
}

/* Updates global variable with given name. */
function lisp_set_js_global(name, value) {
    lisp_assert(lisp_is_instance(name, Lisp_String));
    lisp_assert(lisp_is_instance(value, Lisp_Object));
    window[lisp_string_native_string(name)] = value;
    return name;
}

/* Calls a method of an object. */
function lisp_js_call(obj, sel) {
    lisp_assert(lisp_is_instance(obj, Lisp_Object));
    lisp_assert(lisp_is_instance(sel, Lisp_String));
    var args = Array.prototype.slice.call(arguments, 2);
    return obj[lisp_string_native_string(sel)].apply(obj, args);
}

/* Creates a JS function from a combiner. */
function lisp_js_function(cmb) {
    lisp_assert(lisp_is_instance(cmb, Lisp_Combiner));
    return function() {
        var args = lisp_array_to_cons_list(Array.prototype.slice.call(arguments));
        return lisp_combine(cmb, args, lisp_make_env(null));
    };
}

/**** Strings ****/

var Lisp_String = String.prototype;

lisp_init_class(Lisp_String, [Lisp_Object]);

/* Creates a new string with the given native string. */
function lisp_make_string(native_string) {
    lisp_assert(lisp_is_native_string(native_string));
    return native_string;
}

/* Returns the native string of the string. */
function lisp_string_native_string(string) {
    lisp_assert(lisp_is_instance(string, Lisp_String));
    return string;
}

/**** Numbers ****/

var Lisp_Number = Number.prototype;

lisp_init_class(Lisp_Number, [Lisp_Object]);

/* Creates a new number from the given native string number
   representation. */
function lisp_make_number(repr) {
    lisp_assert(lisp_is_native_string(repr));
    return Number(repr);
}

/**** Symbols ****/

var lisp_symbols_table = {};

var Lisp_Symbol = lisp_make_system_class(Lisp_Object, "Lisp_Symbol");

/* A symbol evaluates to the value of the binding it names. */
Lisp_Symbol.lisp_eval = function(symbol, env) {
    return lisp_env_lookup(env, symbol);
};

/* A symbol matches anything and binds the operand in the environment. */
Lisp_Symbol.lisp_match = function(symbol, otree, env) {
    lisp_env_put(env, symbol, otree);
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

var Lisp_Pair = lisp_make_system_class(Lisp_Object, "Lisp_Pair");

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

function lisp_list() {
    return lisp_array_to_cons_list(Array.prototype.slice.call(arguments));
}

/**** Environments ****/

var Lisp_Env = lisp_make_system_class(Lisp_Object, "Lisp_Env");

/* Creates a new empty environment with an optional parent environment. */
function lisp_make_env(parent) {
    lisp_assert((parent === null) || lisp_is_instance(parent, Lisp_Env));
    var env = lisp_make_instance(Lisp_Env);
    env.lisp_parent = parent;
    env.lisp_bindings = Object.create(null);
    return env;
}

/* Updates or creates a binding from a name to a value. */
function lisp_env_put(env, name, value) {
    lisp_assert(lisp_is_instance(env, Lisp_Env));
    lisp_assert(lisp_is_instance(name, Lisp_Symbol));
    lisp_assert(lisp_is_instance(value, Lisp_Object));
    env.lisp_bindings[lisp_symbol_native_string(name)] = value;
    return value;
}

/* Updates or creates a binding from a native string name to a value. */
function lisp_env_put_comfy(env, native_string, value) {
    return lisp_env_put(env, lisp_intern_comfy(native_string), value);
}

/* Looks up the value of a name in the environment and its ancestors. */
function lisp_env_lookup(env, name) {
    lisp_assert(lisp_is_instance(env, Lisp_Env));
    lisp_assert(lisp_is_instance(name, Lisp_Symbol));
    var native_name = lisp_symbol_native_string(name);
    var value = env.lisp_bindings[native_name];
    if (typeof(value) !== "undefined") {
        return value;
    } else {
        if (env.lisp_parent !== null) {
            return lisp_env_lookup(env.lisp_parent, name);
        } else {
            lisp_simple_error("Undefined identifier: " + native_name);
        }
    }
}

/* Updates an existing binding from a name to a value. */
function lisp_env_set(env, name, value) {
    lisp_assert(lisp_is_instance(name, Lisp_Symbol));
    lisp_assert(lisp_is_instance(value, Lisp_Object));
    var native_name = lisp_symbol_native_string(name);
    return lisp_do_set(env, native_name, value);

    function lisp_do_set(env, native_name, value) {
        lisp_assert(lisp_is_instance(env, Lisp_Env));
        if (env.lisp_bindings[native_name] !== undefined) {
            env.lisp_bindings[native_name] = value;
            return value;
        } else {
            if (env.lisp_parent !== null) {
                return lisp_do_set(env.lisp_parent, native_name, value);
            } else {
                lisp_simple_error("Cannot set undefined identifier: " + native_name);
            }
        }
    }
}

/**** Booleans ****/

var Lisp_Boolean = Boolean.prototype;

lisp_init_class(Lisp_Boolean, [Lisp_Object]);

var lisp_t = true;

var lisp_f = false;

/**** Nil ****/

var Lisp_Nil = lisp_make_system_class(Lisp_Object, "Lisp_Nil");

var lisp_nil = lisp_make_instance(Lisp_Nil);

/* Nil matches only itself. */
Lisp_Nil.lisp_match = function(nil, otree, env) {
    if (otree !== lisp_nil) {
        lisp_simple_error("Expected nil.");
    }
};

/**** Ignore ****/

var Lisp_Ignore = lisp_make_system_class(Lisp_Object, "Lisp_Ignore");

var lisp_ignore = lisp_make_instance(Lisp_Ignore);

/* Ignore matches anything. */
Lisp_Ignore.lisp_match = function(ignore, otree, env) {
};

/**** Void ****/

var Lisp_Void = lisp_make_system_class(Lisp_Object, "Lisp_Void");

var lisp_void = null;

/**** Undefined ****/

var Lisp_Undefined = lisp_make_system_class(Lisp_Object, "Lisp_Undefined");

var lisp_undefined = undefined;

/**** Combiners ****/

var Lisp_Combiner = lisp_make_system_class(Lisp_Object, "Lisp_Combiner");

/*** Compound Combiners ***/

/* Compound combiners are those created by $vau.  They contain a
   parameter tree, a formal lexical environment parameter, a body, and
   a static lexical environment link. */

var Lisp_Compound_Combiner = lisp_make_system_class(Lisp_Combiner, "Lisp_Compound_Combiner");

function lisp_make_compound_combiner(ptree, envformal, body, senv) {
    lisp_assert(lisp_is_instance(ptree, Lisp_Object));
    lisp_assert(lisp_is_instance(envformal, Lisp_Object));
    lisp_assert(lisp_is_instance(body, Lisp_Object));
    lisp_assert(lisp_is_instance(senv, Lisp_Env));
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
    var xenv = lisp_make_env(cmb.lisp_senv);
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

var Lisp_Wrapper = lisp_make_system_class(Lisp_Combiner, "Lisp_Wrapper");

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

var Lisp_Vau = lisp_make_system_class(Lisp_Combiner, "Lisp_Vau");

Lisp_Vau.lisp_combine = function(cmb, otree, env) {
    var ptree = lisp_elt(otree, 0);
    var envformal = lisp_elt(otree, 1);
    var body = lisp_elt(otree, 2);
    return lisp_make_compound_combiner(ptree, envformal, body, env);
};

/*** $begin ***/

/* Evaluates forms in sequence, returning value of last, or #void if
   there are no forms.

   ($begin . forms) -> result */

var Lisp_Begin = lisp_make_system_class(Lisp_Combiner, "Lisp_Begin");

Lisp_Begin.lisp_combine = function(cmb, otree, env) {
    var res = lisp_void;
    while(otree !== lisp_nil) {
        res = lisp_eval(lisp_car(otree), env);
        otree = lisp_cdr(otree);
    };
    return res;
};

/*** $define! ***/

/* Matches a parameter tree against an operand tree in the current
   environment.

   ($define! ptree otree) -> ptree */

var Lisp_Define = lisp_make_system_class(Lisp_Combiner, "Lisp_Define");

Lisp_Define.lisp_combine = function(cmb, otree, env) {
    var lhs = lisp_elt(otree, 0);
    var rhs = lisp_elt(otree, 1);
    lisp_match(lhs, lisp_eval(rhs, env), env);
    return lhs;
};

/*** $set! ***/

/* Updates the value of an existing binding.

   ($set! name value) -> value */

var Lisp_Set = lisp_make_system_class(Lisp_Combiner, "Lisp_Set");

Lisp_Set.lisp_combine = function(cmb, otree, env) {
    var name = lisp_elt(otree, 0);
    var value = lisp_elt(otree, 1);
    return lisp_env_set(env, name, lisp_eval(value, env));
};

/*** $if ***/

/* Performs either the consequent or alternative expression, depending
   on the boolean result of the test expression.

   ($if test consequent alternative) -> result */

var Lisp_If = lisp_make_system_class(Lisp_Combiner, "Lisp_If");

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

var Lisp_Loop = lisp_make_system_class(Lisp_Combiner, "Lisp_Loop");

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

var Lisp_Unwind_Protect = lisp_make_system_class(Lisp_Combiner, "Lisp_Unwind_Protect");

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

var Lisp_Throw = lisp_make_system_class(Lisp_Combiner, "Lisp_Throw");

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

var Lisp_Catch = lisp_make_system_class(Lisp_Combiner, "Lisp_Catch");

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

/* A native combiner contains a native function.  By default, it gets
   called with the list of unevaluated arguments (it doesn't receive
   the operand tree as is).  To have arguments evaluated, wrap it. */

var Lisp_Native_Combiner = lisp_make_system_class(Lisp_Combiner, "Lisp_Native_Combiner");

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
    lisp_assert(lisp_is_native_function(native_fun));
    var cmb = lisp_make_instance(Lisp_Native_Combiner);
    cmb.lisp_native_fun = native_fun;
    cmb.lisp_min_args = min_args;
    cmb.lisp_max_args = max_args;
    return cmb;
}

/* Creates a new native wrapper for the native function. */
function lisp_make_wrapped_native(native_fun, min_args, max_args) {
    return lisp_wrap(lisp_make_native(native_fun, min_args, max_args));
}

/**** Library ****/

/* Library functions are those that are exported to Lisp, but usually
   not directly used in the implementation from JavaScript.  However,
   there is no clear distinction between library and "non-library"
   functions - there are also functions exported to Lisp that are not
   marked as library.  It's important that all exported functions deal
   with Lisp values (e.g. booleans), and not JavaScript values. */

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

function lisp_lib_make_env(optional_parent) {
    return lisp_make_env(optional_parent !== undefined ? optional_parent : null);
}

function lisp_lib_eq(a, b) {
    return lisp_truth(a === b);
}

function lisp_lib_null(obj) {
    return lisp_lib_eq(obj, lisp_nil);
}

function lisp_lib_make_class(sups) {
    return lisp_make_user_class(lisp_cons_list_to_array(sups), "Lisp_User_Class");
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
    lisp_assert(lisp_is_instance(slot, Lisp_String));
    var value = obj[lisp_string_native_string(slot)];
    if (typeof(value) !== "undefined") {
        return value;
    } else {
        lisp_simple_error("Unbound slot: " + lisp_string_native_string(slot));
    }
}

function lisp_lib_has_slot(obj, slot) {
    lisp_assert(lisp_is_instance(obj, Lisp_Object));
    lisp_assert(lisp_is_instance(slot, Lisp_String));
    var value = obj[lisp_string_native_string(slot)];
    return lisp_truth(typeof(value) !== "undefined");
}

function lisp_lib_set_slot(obj, slot, value) {
    lisp_assert(lisp_is_instance(obj, Lisp_Object));
    lisp_assert(lisp_is_instance(slot, Lisp_String));
    lisp_assert(lisp_is_instance(value, Lisp_Object));
    obj[lisp_string_native_string(slot)] = value;
    return value;
}

function lisp_lib_put_method(c, sel, cmb) {
    lisp_assert(lisp_is_instance(c, Lisp_Class));
    lisp_assert(lisp_is_instance(sel, Lisp_String));
    lisp_assert(lisp_is_instance(cmb, Lisp_Combiner));
    lisp_put_method(c, lisp_string_native_string(sel), cmb);
    return sel;
}

function lisp_lib_send(obj, sel, otree) {
    lisp_assert(lisp_is_instance(obj, Lisp_Object));
    lisp_assert(lisp_is_instance(sel, Lisp_String));
    lisp_assert(lisp_is_instance(otree, Lisp_Object));
    return lisp_send(obj, lisp_string_native_string(sel), otree);
}

function lisp_lib_error(string) {
    lisp_assert(lisp_is_instance(string, Lisp_String));
    lisp_simple_error(lisp_string_native_string(string));
}

/*** Equality ***/

/* A note: native functions implementing these methods don't need to
   be wrapped, because the generic functions already evaluate the
   arguments. */

function lisp_equal(a, b) {
    return lisp_send(a, "=", lisp_list(b));
}

lisp_put_native_method(Lisp_Object, "=", function(obj, other) {
    return lisp_lib_eq(obj, other);
});

/*** Printing ***/

function lisp_to_string(obj) {
    return lisp_send(obj, "to-string", lisp_nil);
}

function lisp_to_native_string(obj) {
    return lisp_string_native_string(lisp_to_string(obj));
}

lisp_put_native_method(Lisp_Object, "to-string", function(obj) {
    var res;
    if (typeof(obj) === "undefined") {
        res = "undefined";
    } else {
        try {
            res = JSON.stringify(obj);
        } catch(ignore) {
            res = obj.toString() + " (non-JSON)";
        }
    }
    return lisp_make_string("#[object " + res + "]");
});

lisp_put_native_method(Lisp_Class, "to-string", function(obj) {
    return lisp_make_string("#[class]");
});

lisp_put_native_method(Lisp_String, "to-string", function(obj) {
    return obj;
});

lisp_put_native_method(Lisp_Number, "to-string", function(obj) {
    return lisp_make_string(obj.toString());
});

lisp_put_native_method(Lisp_Boolean, "to-string", function(obj) {
    return obj ? lisp_make_string("#t") : lisp_make_string("#f");
});

lisp_put_native_method(Lisp_Pair, "to-string", function(obj) {
    var car = lisp_car(obj);
    var cdr = lisp_cdr(obj);
    var car_string = lisp_string_native_string(lisp_to_string(car));
    if (cdr !== lisp_nil) {
        var cdr_string = lisp_string_native_string(lisp_to_string(cdr));
        return lisp_make_string("(" + car_string + " . " + cdr_string + ")");
    } else {
        return lisp_make_string("(" + car_string + ")");
    }
});

lisp_put_native_method(Lisp_Symbol, "to-string", function(obj) {
    return lisp_symbol_name(obj);
});

lisp_put_native_method(Lisp_Nil, "to-string", function(obj) {
    return lisp_make_string("()");
});

lisp_put_native_method(Lisp_Ignore, "to-string", function(obj) {
    return lisp_make_string("#ignore");
});

lisp_put_native_method(Lisp_Void, "to-string", function(obj) {
    return lisp_make_string("#void");
});

lisp_put_native_method(Lisp_Combiner, "to-string", function(obj) {
    return lisp_make_string("#[combiner]");
});

lisp_put_native_method(Lisp_Compound_Combiner, "to-string", function(obj) {
    // hack
    return lisp_make_string("#[compound-combiner " + lisp_string_native_string(lisp_to_string(obj.lisp_ptree)) + "]");
});

lisp_put_native_method(Lisp_Wrapper, "to-string", function(obj) {
    // hack
    return lisp_make_string("#[wrapper " + lisp_string_native_string(lisp_to_string(obj.lisp_underlying)) + "]");
});

/**** Errors, Assertions, and Abominations ****/

function lisp_simple_error(msg) {
    throw msg;
}

function lisp_assert(bool) {
    if (!bool) {
        lisp_simple_error("Assertion failed.");
    }
}

function lisp_is_native_string(native_string) {
    return typeof(native_string.substring) !== "undefined";
}

function lisp_is_native_array(native_array) {
    return (native_array instanceof Array);
}

function lisp_is_native_function(native_function) {
    return typeof(native_function) === "function";
}

function lisp_native_array_contains(native_array, obj) {
    return (native_array.indexOf(obj) !== -1);
}

/**** Parser ****/

/* Returns a cons list of the forms in the string. */
function lisp_read_from_string(s) {
    return lisp_array_to_cons_list(lisp_parse(s));
}

/* Returns an array of the forms in the native string. */
function lisp_parse(string) {
    lisp_assert(lisp_is_native_string(string));
    var result = lisp_program_syntax(ps(string));
    if (result.remaining.index === string.length) {
        return result.ast;
    } else {
        lisp_simple_error("Parse error at index: " + result.remaining.index);
    }
}

var lisp_expression_syntax =
    function(input) { return lisp_expression_syntax(input); }; // forward decl.

var lisp_identifier_special_char =
    choice("-", "&", "!", ":", "=", ">", "<", "%",
           "+", "?", "/", "*", "#", "$", "_", "'", ".");

var lisp_identifier_char =
    choice(range("a", "z"),
           range("A", "Z"),
           range("0", "9"),
           lisp_identifier_special_char);

// Kludge: don't allow single dot as identifier, so as not to conflict
// with dotted pair syntax.
var lisp_identifier_syntax =
    action(join_action(butnot(repeat1(lisp_identifier_char), "."), ""),
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

function lisp_make_constant_syntax(string, constant) {
    return action(string, function(ast) { return constant; });
}

var lisp_nil_syntax =
    lisp_make_constant_syntax("()", lisp_nil);

var lisp_ignore_syntax =
    lisp_make_constant_syntax("#ignore", lisp_ignore);

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
           lisp_nothing_action);

var lisp_whitespace_syntax =
    action(choice(" ", "\n", "\r", "\t"), lisp_nothing_action);

function lisp_nothing_action(ast) { // HACK!
    return lisp_void;
}

var lisp_expression_syntax =
    whitespace(choice(lisp_number_syntax,
                      lisp_nil_syntax,
                      lisp_ignore_syntax,
                      lisp_compound_syntax,
                      lisp_identifier_syntax,
                      lisp_string_syntax,
                      lisp_line_comment_syntax));

var lisp_program_syntax =
    whitespace(repeat0(choice(lisp_expression_syntax,
                              lisp_whitespace_syntax))); // HACK!


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
