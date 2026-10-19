**`event`** — synchronization object

A handle that processes can trigger with `->` and wait on with `@` or `wait (ev.triggered)`. `wait (ev.triggered)` also catches a trigger earlier in the same time step, avoiding a race with `@`. Events can be assigned and passed like handles.

```systemverilog
event done;
initial begin
  #50 -> done;
end
initial begin
  wait (done.triggered);
  $display("done at %0t", $time);
end
```
