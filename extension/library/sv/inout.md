**`inout`** — bidirectional port

A port that can both drive and receive, such as a tri-state pad. It must be a net, and you drive it with `'z` when not driving. In tasks and functions, an `inout` argument is copied in and copied back.

```systemverilog
module pad (inout wire io, input logic oe, dout, output logic din);
  assign io  = oe ? dout : 1'bz;
  assign din = io;
endmodule
```
