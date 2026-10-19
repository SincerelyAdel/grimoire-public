**`wor`** — wired-OR net

Multiple drivers are combined with OR: any driver at 1 makes the net 1.

```systemverilog
wor irq;
assign irq = irq_uart;
assign irq = irq_timer;
```
