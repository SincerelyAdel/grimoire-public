**`return`** — leave a function or task

Ends the current function or task. In a non-void function, `return expr;` also sets the result; assigning to the function name is the older alternative. In a void function or task, use `return;` with no value.

```systemverilog
function automatic int find(int q[$], int key);
  foreach (q[i]) if (q[i] == key) return i;
  return -1;
endfunction
```
