($define! $quote ($vau (form) #ignore form))

($define! $sequence
   ((wrap ($vau ($seq2) #ignore
             ($seq2
                ($define! $aux
                   ($vau (head . tail) env
                      ($if (null? tail)
                           (eval head env)
                           ($seq2
                              (eval head env)
                              (eval (cons $aux tail) env)))))
                ($vau body env
                   ($if (null? body)
                        #inert
                        (eval (cons $aux body) env))))))

      ($vau (first second) env
         ((wrap ($vau #ignore #ignore (eval second env)))
          (eval first env)))))

($define! list (wrap ($vau x #ignore x)))

($define! list*
   (wrap ($vau args #ignore
            ($sequence
               ($define! aux
                  (wrap ($vau ((head . tail)) #ignore
                           ($if (null? tail)
                                head
                                (cons head (aux tail))))))
               (aux args)))))

($define! $vau
   ((wrap ($vau ($vau) #ignore
             ($vau (formals eformal . body) env
                (eval (list $vau formals eformal
                           (cons $sequence body))
                      env))))
      $vau))

($define! $lambda
   ($vau (formals . body) env
      (wrap (eval (list* $vau formals #ignore body)
                  env))))

($define! caar ($lambda (((x . #ignore) . #ignore)) x))
($define! cdar ($lambda (((#ignore . x) . #ignore)) x))
($define! cadr ($lambda ((#ignore . (x . #ignore))) x))
($define! cddr ($lambda ((#ignore . (#ignore . x))) x))

($define! apply
   ($lambda (appv arg . opt)
      (eval (cons (unwrap appv) arg)
            ($if (null? opt)
                 (make-environment)
                 (car opt)))))

($define! $cond
   ($vau clauses env

      ($define! aux
         ($lambda ((test . body) . clauses)
            ($if (eval test env)
                 (apply (wrap $sequence) body env)
                 (apply (wrap $cond) clauses env))))

      ($if (null? clauses)
           #inert
           (apply aux clauses))))

($define! not? ($lambda (x) ($if x #f #t)))

($define! get-current-environment (wrap ($vau () e e)))

($define! $let
   ($vau (bindings . body) env
      (eval (cons (list* $lambda (map car bindings) body)
                  (map cadr bindings))
            env)))

($define! $let*
   ($vau (bindings . body) env
      (eval ($if (null? bindings)
                 (list* $let bindings body)
                 (list $let
                       (list (car bindings))
                       (list* $let* (cdr bindings) body)))
            env)))

($define! $letrec
   ($vau (bindings . body) env
      (eval (list* $let ()
                   (list $define!
                         (map car bindings)
                         (list* list (map cadr bindings)))
                   body)
            env)))

($define! $letrec*
   ($vau (bindings . body) env
      (eval ($if (null? bindings)
                 (list* $letrec bindings body)
                 (list $letrec
                       (list (car bindings))
                       (list* $letrec* (cdr bindings) body)))
            env)))

($define! $let-redirect
   ($vau (exp bindings . body) env
      (eval (list* (eval (list* $lambda (map car bindings) body)
                         (eval exp
                               env))
                   (map cadr bindings))
            env)))

($define! $let-safe
   ($vau (bindings . body) env
      (eval (list* $let-redirect
                   (make-kernel-standard-environment)
                   bindings
                   body)
             env)))

($define! $remote-eval
   ($vau (o e) d
      (eval o (eval e d))))

($define! $bindings->environment
   ($vau bindings denv
      (eval (list $let-redirect
                  (make-environment)
                  bindings
                  (list get-current-environment))
            denv)))

($define! $set!
   ($vau (exp1 formals exp2) env
      (eval (list $define! formals
                  (list (unwrap eval) exp2 env))
            (eval exp1 env))))

($define! $provide!
   ($vau (symbols . body) env
      (eval (list $define! symbols
               (list $let ()
                  (list* $sequence body)
                  (list* list symbols)))
            env)))

($define! $import!
   ($vau (exp . symbols) env
      (eval (list $set!
                  env
                  symbols
                  (cons list symbols))
            (eval exp env))))

($define! for-each
   (wrap ($vau x env
            (apply map x env)
            #inert)))
