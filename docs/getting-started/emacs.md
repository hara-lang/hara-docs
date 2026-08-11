# Get started with Emacs

Emacs can be used as a source-first Hara environment without waiting for a
large editor integration. Edit `.hal` files with Lisp-aware indentation, keep a
Hara process available, and send a region through the CLI when you want an
immediate result.

This page starts with a small editor-agnostic setup. It does not require a
special Hara package or a private editor protocol.

## Install the Hara CLI first

Confirm that Emacs can find the same `hara` command as your terminal:

```shell
hara eval '(+ 19 23)'
```

If Emacs is launched from the desktop on macOS, its environment may not inherit
your shell `PATH`. Evaluate this in Emacs to inspect the executable search path:

```elisp
(getenv "PATH")
```

Add the installation directory when necessary:

```elisp
(add-to-list 'exec-path (expand-file-name "~/.local/bin"))
(setenv "PATH"
        (concat (expand-file-name "~/.local/bin")
                path-separator
                (getenv "PATH")))
```

Restart Emacs or evaluate the configuration, then check:

```elisp
(executable-find "hara")
```

## Give `.hal` files a useful major mode

Hara is a Lisp, so an existing Lisp-aware mode gives you balanced forms,
indentation, comments, structural movement, and syntax highlighting.

When `clojure-mode` is installed, associate it with `.hal` files:

```elisp
(add-to-list 'auto-mode-alist '("\\.hal\\'" . clojure-mode))
```

This is an editing convenience, not a claim that Hara is Clojure. Hara has its
own runtime, project model, libraries, native flavors, and language contract.
Some highlighting and indentation rules may be approximate until a dedicated
Hara mode is available.

Without `clojure-mode`, use a built-in Lisp mode:

```elisp
(add-to-list 'auto-mode-alist '("\\.hal\\'" . lisp-mode))
```

## Evaluate the current region

The CLI accepts source through `hara stdin`. That makes a small Emacs command
possible without copying source into a shell command line.

Add this function to your configuration:

```elisp
(defun hara-eval-region (begin end)
  "Evaluate Hara source from BEGIN to END."
  (interactive "r")
  (when (and (called-interactively-p 'interactive)
             (not (use-region-p)))
    (user-error "Select a complete Hara form first"))
  (let ((result-buffer (get-buffer-create "*Hara Result*")))
    (with-current-buffer result-buffer
      (erase-buffer))
    (let ((status
           (call-process-region
            begin end
            "hara"
            nil result-buffer nil
            "stdin")))
      (display-buffer result-buffer)
      (unless (and (integerp status) (zerop status))
        (message "Hara exited with status %s" status)))))
```

Bind it in the mode you use for `.hal` files:

```elisp
(with-eval-after-load 'clojure-mode
  (define-key clojure-mode-map
              (kbd "C-c C-e")
              #'hara-eval-region))
```

For `lisp-mode` instead:

```elisp
(with-eval-after-load 'lisp-mode
  (define-key lisp-mode-map
              (kbd "C-c C-e")
              #'hara-eval-region))
```

Open a `.hal` file, select a complete form, and press `C-c C-e`.

Try:

```hara
(let [x 19]
  (+ x 23))
```

The result appears in `*Hara Result*`.

## Evaluate the form around point

Region evaluation is explicit and reliable. After that works, add a helper that
uses the surrounding list when no region is active:

```elisp
(defun hara-eval-dwim ()
  "Evaluate the region, or the list surrounding point."
  (interactive)
  (if (use-region-p)
      (hara-eval-region (region-beginning) (region-end))
    (save-excursion
      (let ((end (progn (end-of-defun) (point)))
            (begin (progn (beginning-of-defun) (point))))
        (hara-eval-region begin end)))))
```

Bind it:

```elisp
(with-eval-after-load 'clojure-mode
  (define-key clojure-mode-map
              (kbd "C-c C-c")
              #'hara-eval-dwim))
```

Because this uses generic Emacs form navigation, inspect the selected text when
working with unusual reader forms or incomplete code. A dedicated Hara mode can
later replace this heuristic with reader-aware selection.

## Keep a terminal REPL inside Emacs

For a persistent interactive session, use `M-x ansi-term`, `M-x term`, or
`M-x shell`, then run:

```shell
hara
```

A persistent REPL remembers definitions and current state. This is different
from the `hara stdin` helper above, which starts a command for the selected
source and is best for small independent evaluations.

Use the terminal REPL when definitions need to accumulate in one session. Use
region evaluation when you want a simple editor command with no connection
state.

## Run the current file

Add a command for `hara run`:

```elisp
(defun hara-run-current-file ()
  "Save and run the current Hara file."
  (interactive)
  (unless buffer-file-name
    (user-error "The current buffer is not visiting a file"))
  (save-buffer)
  (let ((command
         (format "hara run %s"
                 (shell-quote-argument buffer-file-name))))
    (compilation-start command
                       'compilation-mode
                       (lambda (_) "*Hara Run*"))))
```

Bind it:

```elisp
(with-eval-after-load 'clojure-mode
  (define-key clojure-mode-map
              (kbd "C-c C-k")
              #'hara-run-current-file))
```

The compilation buffer preserves output, supports rerunning, and gives the
workflow a clear source-file boundary.

## Use a project layout

Open the project root as an Emacs project:

```text
my-project/
  project.edn
  workspace.edn
  src/
    app.hal
```

Keep executable source in `.hal` files. Keep project and workspace descriptions
in `project.edn` and `workspace.edn`. Use `project-find-file`, Projectile, or
another project navigator to move through the tree; Hara does not require a
particular Emacs project package.

A useful daily loop is:

1. Open the project root.
2. Start a Hara REPL in a terminal buffer.
3. Edit one namespace in `src/`.
4. Evaluate a complete form or run the file.
5. Inspect the value or failure.
6. keep the successful change in source.

## Add formatting and structural editing

Hara code benefits from balanced-form editing. Packages such as Paredit,
Smartparens, or Puni can help prevent unbalanced parentheses and move complete
forms safely. Configure them according to the major mode selected for `.hal`.

Avoid making the editor rewrite code according to Clojure-specific semantics.
Indentation is useful; assumptions about Clojure namespaces, build tools, REPL
protocols, or dependency files are not automatically valid for Hara.

## Connect to a long-running Hara server later

The minimal setup deliberately uses the CLI. A richer Emacs client can connect
to Hara's RESP listener, select or create a session, evaluate source in that
session, and display structured results.

That integration should preserve these boundaries:

- the editor owns source selection and presentation;
- the Hara server owns kernels and sessions;
- evaluation targets an explicit session;
- host capabilities remain attached to the session;
- source files remain the durable project record.

The default editor endpoint used by the current tooling is `127.0.0.1:4164`, but
a client should let the user choose the host, port, and session rather than
assuming one global REPL.

## Troubleshooting

When Emacs reports that `hara` is missing, compare `(getenv "PATH")` and
`exec-path` with the shell where the command works.

When a selected form fails unexpectedly, copy the exact region into a terminal
and run it through `hara stdin`. This separates an editor selection problem
from a runtime problem.

When a file works in a fresh command but not in a persistent REPL, inspect the
current namespace and definitions in that REPL. Live sessions retain state; a
fresh CLI process does not.

## Continue

Read [Get started with the CLI](cli.md) for the runtime commands, the
[kernel and REPL reference](../kernel.md#repl-workflow) for session behavior, and
[projects and namespaces](../projects/index.md) when the project grows
beyond one file.
