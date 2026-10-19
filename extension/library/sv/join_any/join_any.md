**`join_any`** — end of a fork that waits for the first process

Closes a `fork` and continues as soon as any one of its processes finishes. The others keep running; stop them with `disable fork` if needed. Common for timeouts.

---

**Coding example**

```systemverilog
fork
  wait (done);
  #1us $error("timeout");
join_any
disable fork;
```

---

**Visual**

<img src="behavior.svg" width="300">
