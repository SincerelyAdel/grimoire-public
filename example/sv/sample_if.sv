interface sample_if #(
    parameter int unsigned WIDTH = 8
) (
    input logic clk
);

    logic             valid;
    logic [WIDTH-1:0] data;
    logic             ready;

    modport source (
        output valid,
        output data,
        input  ready
    );

    modport sink (
        input  valid,
        input  data,
        output ready
    );

endinterface
