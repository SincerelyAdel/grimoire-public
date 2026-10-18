**`join`** — end of a fork that waits for every process

Closes a `fork` and waits until all of its processes have finished before continuing.

```systemverilog
fork
  send_packet();
  receive_packet();
join   // both done here
```
