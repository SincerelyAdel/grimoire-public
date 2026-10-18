**`specparam`** — timing parameter for specify blocks

A parameter meant for timing values in `specify` blocks and timing checks. It cannot be overridden by `defparam` or instance parameters.

```systemverilog
specify
  specparam tRISE = 1.2, tFALL = 1.0;
  (a => y) = (tRISE, tFALL);
endspecify
```
