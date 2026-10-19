**`extern`** — declare now, define elsewhere

In a class, `extern function`/`extern task` declares a method's prototype, with the body written outside the class using `class_name::method`. Also used for `extern constraint` and for `extern module` declarations.

```systemverilog
class fifo_model;
  extern function void push(int v);
endclass

function void fifo_model::push(int v);
  q.push_back(v);
endfunction
```
