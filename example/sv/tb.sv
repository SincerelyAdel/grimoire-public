`define CLK_PERIOD 10

class driver;

    virtual sample_if #(.WIDTH(demo_pkg::WIDTH)) vif;
    static int unsigned created = 0;

    function new(virtual sample_if #(.WIDTH(demo_pkg::WIDTH)) bus);
        vif = bus;
        created++;
    endfunction

    task automatic accept();
        vif.ready <= 1'b1;
        @(posedge vif.clk iff vif.valid);
        vif.ready <= 1'b0;
    endtask

endclass

module tb;
    import demo_pkg::*;

    bit               clk;
    logic             rst_n;
    logic             start;
    reg [WIDTH-1:0]   step;
    wire              done;
    wire [WIDTH-1:0]  reversed;
    integer           cycles = 0;
    int               errors = 0;
    logic [WIDTH-1:0] held;

    sample_if #(.WIDTH(WIDTH)) bus (.clk(clk));

    counter #(.LIMIT(5)) dut (
        .clk  (clk),
        .rst_n(rst_n),
        .start(start),
        .step (step),
        .out  (bus)
    );

    assign done = bus.valid;

    always #(`CLK_PERIOD / 2) clk = ~clk;

    always @( negedge clk ) cycles = cycles + 1;

    always_latch begin : hold_result
        if (done) held = bus.data;
    end

    generate
        for (genvar i = 0; i < WIDTH; i++) begin : g_reverse
            assign reversed[i] = held[WIDTH-1-i];
        end
    endgenerate

    function automatic string describe(input logic [WIDTH-1:0] value);
        priority if (value == '0) return "zero";
        else if (value == '1) return "saturated";
        else return "partial";
    endfunction

    task automatic reset();
        rst_n = 1'b0;
        repeat (2) @(posedge clk);
        rst_n = 1'b1;
    endtask

    initial begin
        driver drv;
        drv   = new(bus);
        start = 1'b0;
        step  = 8'd60;
        reset();
        fork
            begin
                @(posedge clk) start <= 1'b1;
                @(posedge clk) start <= 1'b0;
            end
            drv.accept();
        join
        if (held != '1) errors++;
        $display("result %0d (%s), reversed %b, %0d cycles", held, describe(held), reversed, cycles);
        $finish;
    end

    final $display("%0d error(s), %0d driver(s)", errors, driver::created);

endmodule
