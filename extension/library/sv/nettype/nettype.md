**`nettype`** — user-defined net type

Declares a net type with a custom data type and, optionally, a resolution function that combines multiple drivers. Used for analog-style modelling such as real-valued nets.

```systemverilog
typedef struct { real v; real i; } elec_t;
function automatic elec_t resolve(input elec_t d[]);
  foreach (d[k]) resolve.i += d[k].i;
endfunction
nettype elec_t elec_net with resolve;
```
