**`do_pack`** — the hooks you implement so that `pack()` and `unpack()` work (`do_pack`, `do_unpack`)

`uvm_object::pack()` and its variants call the virtual `do_pack(packer)`, and `unpack()` calls `do_unpack(packer)`. Override both to serialise your fields into a stream of bits and to rebuild them from one. This is how a structured transaction is turned into the bit or byte sequence a serial protocol driver sends, and back again in the monitor.

**Signatures**

```systemverilog
virtual function void do_pack  (uvm_packer packer);
virtual function void do_unpack(uvm_packer packer);
```

**Example**

```systemverilog
class fifo_frame extends uvm_sequence_item;
    `uvm_object_utils(fifo_frame)

    rand bit [3:0]     tag;
    rand bit [7:0]     payload[];
    bit      [7:0]     checksum;

    virtual function void do_pack(uvm_packer packer);
        super.do_pack(packer);
        packer.pack_field_int(tag, 4);
        packer.pack_field_int(payload.size(), 8);          // length, so unpack knows the size
        foreach (payload[i]) packer.pack_field_int(payload[i], 8);
        packer.pack_field_int(checksum, 8);
    endfunction

    virtual function void do_unpack(uvm_packer packer);
        int unsigned n;
        super.do_unpack(packer);
        tag     = packer.unpack_field_int(4);
        n       = packer.unpack_field_int(8);
        payload = new[n];
        foreach (payload[i]) payload[i] = packer.unpack_field_int(8);
        checksum = packer.unpack_field_int(8);
    endfunction
endclass

// Driver
byte unsigned bytes[];
void'(frame.pack_bytes(bytes));
foreach (bytes[i]) send_byte(bytes[i]);

// Monitor
fifo_frame rx = fifo_frame::type_id::create("rx");
void'(rx.unpack_bytes(collected_bytes));
```

**The calling methods**

| Pack | Unpack | Stream type |
| --- | --- | --- |
| `pack(ref bit bitstream[], ...)` | `unpack(ref bit bitstream[], ...)` | Bits |
| `pack_bytes(ref byte unsigned bytestream[], ...)` | `unpack_bytes(...)` | Bytes |
| `pack_ints(ref int unsigned intstream[], ...)` | `unpack_ints(...)` | 32-bit words |

Each returns the number of bits packed or unpacked.

**Rules**

- Unpack in exactly the order you pack.
- Dynamic arrays, queues and strings need their length in the stream, either packed by hand as above or by setting `packer.use_metadata = 1`.
- Call the `super` method first in both.

**Notes**

- Fields registered with `` `uvm_field_* `` macros are packed automatically in declaration order, unless flagged `UVM_NOPACK`.
- The default packer is big-endian: the first field packed occupies the most significant bits.

**See also**: `uvm_packer`, `do_copy`, `do_compare`, `uvm_object`, `UVM_ALL_ON`
