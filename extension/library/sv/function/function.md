**`function`** — subroutine that returns a value in zero time

Runs without consuming simulation time, so it cannot contain delays or event controls. Returns a value unless declared `void`. Declare it `automatic` so each call gets its own variables. Ends with `endfunction`.

```systemverilog
function automatic logic [7:0] add(input logic [7:0] a, b);
  return a + b;
endfunction
```
