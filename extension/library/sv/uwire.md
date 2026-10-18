**`uwire`** — net that allows a single driver

Like `wire`, but having more than one driver is an error. Catches accidental multiple drivers at compile time.

```systemverilog
uwire ready;
assign ready = fifo_ok & link_up;
```
