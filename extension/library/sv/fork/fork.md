**`fork`** — start parallel processes

Runs each statement inside as a separate process. Ending with `join` waits for all of them, `join_any` waits for the first to finish, and `join_none` does not wait at all.

```systemverilog
fork
  drive_request();
  wait_for_response();
join
```
