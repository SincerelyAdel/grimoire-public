**`ref`** — pass an argument by reference

A `ref` argument refers to the caller's variable, so the callee sees and makes changes immediately, without copying. Only allowed in `automatic` subroutines. Use `const ref` to pass large arrays cheaply without allowing changes.

```systemverilog
function automatic void clear(ref int q[$]);
  q.delete();
endfunction

function automatic int sum(const ref int a[]);
  foreach (a[i]) sum += a[i];
endfunction
```
