**`join`** — end of a fork that waits for every process

Closes a `fork` and waits until all of its processes have finished before continuing.

---

**Coding example**

```systemverilog
fork
  send_packet();
  receive_packet();
join   // both done here
```

---

**Visual**

<img src="behavior.svg" width="300">
