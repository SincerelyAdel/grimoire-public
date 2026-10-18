**`join_none`** — end of a fork that does not wait

Closes a `fork` and continues at once, leaving its processes running in the background. They start once the parent blocks or finishes. In a loop, copy the loop variable into an `automatic` variable first, or every process sees the last value.

```systemverilog
for (int i = 0; i < 4; i++) begin
  automatic int k = i;
  fork
    run_channel(k);
  join_none
end
wait fork;
```
