**`property`** — named temporal behaviour

Describes behaviour over clock cycles, built from sequences and implication operators. It does nothing by itself and is checked with `assert property`, `assume property` or `cover property`. Ends with `endproperty`.

---

**Coding example**

```systemverilog
property p_handshake;
  @(posedge clk) disable iff (!rst_n)
  req |-> ##[1:3] ack;
endproperty

assert property (p_handshake);
```

---

**Visual**

<img src="behavior.svg" width="300">
