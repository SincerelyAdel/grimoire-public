module counter
    import demo_pkg::*;
#(
    parameter int unsigned LIMIT = 10
) (
    input logic             clk,
    input logic             rst_n,
    input logic             start,
    input logic [WIDTH-1:0] step,
    sample_if.source        out
);

    localparam int unsigned COUNT_W = $clog2(LIMIT + 1);

    state_t             state, next_state;
    logic [COUNT_W-1:0] ticks;
    logic [WIDTH-1:0]   total;
    sample_u            sample;

    always_ff @( posedge clk, negedge rst_n ) begin : state_reg
        if (!rst_n) state <= IDLE;
        else state <= next_state;
    end

    always_comb begin : next_state_logic
        next_state = state;
        unique case (state)
            IDLE:  if (start) next_state = LOAD;
            LOAD:  next_state = COUNT;
            COUNT: if (ticks == COUNT_W'(LIMIT)) next_state = DONE;
            DONE:  if (out.ready) next_state = IDLE;
        endcase
    end

    always_ff @( posedge clk, negedge rst_n ) begin : datapath
        if (!rst_n) begin
            ticks <= '0;
            total <= '0;
        end else if (state == LOAD) begin
            ticks <= '0;
            total <= '0;
        end else if (state == COUNT) begin
            ticks <= ticks + 1'b1;
            total <= saturate({1'b0, total} + {1'b0, step});
        end
    end

    assign sample.fields = '{valid: state == DONE, data: total};
    assign out.valid     = sample.fields.valid;
    assign out.data      = sample.fields.data;

    property done_follows_count;
        @(posedge clk) disable iff (!rst_n) state == DONE |-> $past(state) inside {COUNT, DONE};
    endproperty

    assert property (done_follows_count);

endmodule
