**`null`** — empty handle

The value of a class handle, `chandle`, `event` or virtual interface that refers to nothing. Calling a method or reading a property through a `null` handle is a run-time error, so check before use.

```systemverilog
packet p;          // p is null until assigned
if (p == null) p = new();
```
