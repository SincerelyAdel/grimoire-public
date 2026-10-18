`ifndef FIFO_IF_SV
`define FIFO_IF_SV

interface fifo_if #(
    parameter int DATA_W = 8
) (
    input logic clk,
    input logic rst_n
);

    logic              wr_en;
    logic [DATA_W-1:0] data_in;
    logic              full;
    logic              rd_en;
    logic [DATA_W-1:0] data_out;
    logic              empty;

    clocking wr_drv_cb @(posedge clk);
        default input #1step output #1;
        output wr_en, data_in;
        input  full;
    endclocking

    clocking rd_drv_cb @(posedge clk);
        default input #1step output #1;
        output rd_en;
        input  empty;
    endclocking

    clocking mon_cb @(posedge clk);
        default input #1step;
        input wr_en, data_in, full, rd_en, data_out, empty;
    endclocking

endinterface

`endif
