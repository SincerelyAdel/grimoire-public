module tb_fifo;
    import uvm_pkg::*;
    `include "uvm_macros.svh"
    import fifo_pkg::*;

    logic clk = 1'b0;
    logic rst_n;

    always #5 clk = ~clk;

    fifo_if fifo_vif (
        .clk  (clk),
        .rst_n(rst_n)
    );

    simple_fifo dut (
        .clk     (clk),
        .rst_n   (rst_n),
        .wr_en   (fifo_vif.wr_en),
        .data_in (fifo_vif.data_in),
        .full    (fifo_vif.full),
        .rd_en   (fifo_vif.rd_en),
        .data_out(fifo_vif.data_out),
        .empty   (fifo_vif.empty)
    );

    initial begin
        rst_n = 1'b0;
        repeat (4) @(posedge clk);
        rst_n = 1'b1;
    end

    initial begin
        uvm_config_db #(virtual fifo_if)::set(null, "uvm_test_top.env*", "vif", fifo_vif);
        run_test();
    end

endmodule
