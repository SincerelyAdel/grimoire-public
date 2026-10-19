**`wait_order`** — wait for events in a given order

Suspends until the listed events trigger in the order given. If an event fires out of order, the optional `else` branch runs, or an error is reported.

```systemverilog
wait_order (req_ev, gnt_ev, done_ev)
  $display("handshake in order");
else
  $error("handshake out of order");
```
