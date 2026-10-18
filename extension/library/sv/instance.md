**`instance`** — configuration rule for one instance

Inside a `config`, applies a `liblist` or `use` rule to a specific hierarchical instance.

```systemverilog
instance tb_top.dut.u_mem use mem_lib.sram_model;
```
