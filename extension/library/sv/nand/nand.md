**`nand`** — built-in NAND gate

A gate-level primitive. The first terminal is the output and the rest are inputs, with any number of inputs. Found mostly in netlists; in RTL write the operator instead. An optional drive strength and delay can follow the keyword.

---

**Coding example**

```systemverilog
nand u_nand (y, a, b);   // y = ~(a & b)
```

---

**Visual**

<img src="behavior.svg" width="300">
