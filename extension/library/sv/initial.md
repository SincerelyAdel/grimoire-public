**`initial`** — process that runs once at time zero

Starts at the beginning of simulation and runs once. Used for testbench stimulus and memory initialisation. Generally not synthesizable for ASIC, though FPGA tools accept it for initial register and RAM values.

```systemverilog
initial begin
  rst_n = 0;
  #20 rst_n = 1;
end
```
