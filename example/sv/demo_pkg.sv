package demo_pkg;

    localparam int unsigned WIDTH = 8;

    typedef enum logic [1:0] {
        IDLE,
        LOAD,
        COUNT,
        DONE
    } state_t;

    typedef struct packed {
        logic             valid;
        logic [WIDTH-1:0] data;
    } sample_t;

    typedef union packed {
        sample_t        fields;
        logic [WIDTH:0] raw;
    } sample_u;

    function automatic logic [WIDTH-1:0] saturate(input logic [WIDTH:0] value);
        return value[WIDTH] ? '1 : value[WIDTH-1:0];
    endfunction

endpackage
