// Test suite for Virtua interpreter.
// Copyright (c) 2012 Manuel Simoni. See license at end of file.

(function() {

    lisp_assert(lisp_is_instance(Lisp_Object, Lisp_Class));
    lisp_assert(lisp_is_instance(Lisp_Class, Lisp_Class));
    lisp_assert(lisp_is_instance(Lisp_String, Lisp_Class));
    lisp_assert(lisp_is_instance(Lisp_Symbol, Lisp_Class));
    lisp_assert(lisp_is_instance(Lisp_Environment, Lisp_Class));
    lisp_assert(lisp_is_instance(Lisp_Pair, Lisp_Class));
    lisp_assert(lisp_is_instance(Lisp_Boolean, Lisp_Class));
    lisp_assert(lisp_is_instance(Lisp_Nil, Lisp_Class));
    lisp_assert(lisp_is_instance(Lisp_Ignore, Lisp_Class));
    lisp_assert(lisp_is_instance(Lisp_Inert, Lisp_Class));
    
    var string_foo = lisp_make_string("foo");
    lisp_assert(lisp_is_instance(string_foo, Lisp_String));
    lisp_assert(!lisp_is_instance(string_foo, Lisp_Symbol));
    lisp_assert(!lisp_is_instance(string_foo, Lisp_Class));
    lisp_assert(lisp_is_instance(string_foo, Lisp_Object));
    lisp_assert(!lisp_is_instance(string_foo, Lisp_Class));
    lisp_assert(lisp_eval(string_foo) === string_foo);
    lisp_assert(lisp_string_native_string(string_foo) === "foo");
    
    var symbol_foo = lisp_intern_comfy("foo");
    lisp_assert(lisp_is_instance(symbol_foo, Lisp_Symbol));
    lisp_assert(!lisp_is_instance(symbol_foo, Lisp_String));
    lisp_assert(!lisp_is_instance(symbol_foo, Lisp_Class));
    lisp_assert(lisp_is_instance(symbol_foo, Lisp_Object));
    lisp_assert(symbol_foo === lisp_intern_comfy("foo"));
    lisp_assert(symbol_foo !== lisp_intern_comfy("bar"));
    lisp_assert(lisp_string_native_string(lisp_symbol_name(symbol_foo)) === "foo");
    lisp_assert(lisp_symbol_native_string(symbol_foo) === "foo");
    
    var cons = lisp_cons(string_foo, symbol_foo);
    lisp_assert(lisp_is_instance(cons, Lisp_Pair));
    lisp_assert(!lisp_is_instance(cons, Lisp_String));
    lisp_assert(!lisp_is_instance(cons, Lisp_Class));
    lisp_assert(lisp_is_instance(cons, Lisp_Object));
    lisp_assert(lisp_car(cons) === string_foo);
    lisp_assert(lisp_cdr(cons) === symbol_foo);

    var env = lisp_make_environment();
    lisp_assert(lisp_environment_put(env, symbol_foo, string_foo) === string_foo);
    lisp_assert(lisp_environment_lookup(env, symbol_foo) === string_foo);
    var child_env = lisp_make_environment(env);
    lisp_assert(lisp_environment_lookup(child_env, symbol_foo) === string_foo);
    var string_bar = lisp_make_string("bar");
    lisp_environment_put(child_env, symbol_foo, string_bar);
    lisp_assert(lisp_environment_lookup(child_env, symbol_foo) === string_bar);
    lisp_assert(lisp_environment_lookup(env, symbol_foo) === string_foo);

    lisp_assert(lisp_eval(symbol_foo, env) === string_foo);
    lisp_assert(lisp_eval(symbol_foo, child_env) === string_bar);
    
    lisp_assert(lisp_is_instance(lisp_nil, Lisp_Nil));
    lisp_assert(lisp_is_instance(lisp_nil, Lisp_Object));
    lisp_assert(lisp_is_instance(lisp_ignore, Lisp_Ignore));
    lisp_assert(lisp_is_instance(lisp_ignore, Lisp_Object));
    lisp_assert(lisp_is_instance(lisp_inert, Lisp_Inert));
    lisp_assert(lisp_is_instance(lisp_inert, Lisp_Object));

}());


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
