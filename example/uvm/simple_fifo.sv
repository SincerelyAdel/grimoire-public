module simple_fifo #(
    parameter int DATA_W = 8,
    parameter int DEPTH  = 8
) (
    input  logic              clk,
    input  logic              rst_n,
    input  logic              wr_en,
    input  logic [DATA_W-1:0] data_in,
    output logic              full,
    input  logic              rd_en,
    output logic [DATA_W-1:0] data_out,
    output logic              empty
);

    localparam int PTR_W = $clog2(DEPTH);

    logic [DATA_W-1:0] mem [DEPTH];
    logic [PTR_W-1:0]  wr_ptr, rd_ptr;
    logic [PTR_W:0]    count;

    assign full  = (count == (PTR_W+1)'($unsigned(DEPTH)));
    assign empty = (count == '0);

    always_ff @( posedge clk, negedge rst_n ) begin : pointers
        if (!rst_n) begin
            wr_ptr   <= '0;
            rd_ptr   <= '0;
            count    <= '0;
            data_out <= '0;
        end else begin
            if (wr_en && !full) begin
                mem[wr_ptr] <= data_in;
                wr_ptr      <= wr_ptr + 1'b1;
            end
            if (rd_en && !empty) begin
                data_out <= mem[rd_ptr];
                rd_ptr   <= rd_ptr + 1'b1;
            end
            case ({wr_en && !full, rd_en && !empty})
                2'b10:   count <= count + 1'b1;
                2'b01:   count <= count - 1'b1;
                default: count <= count;
            endcase
        end
    end

endmodule
