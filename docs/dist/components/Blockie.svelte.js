import './Blockie.svelte.css';
/* src\components\Blockie.svelte generated by Svelte v3.32.1 */
import {
	SvelteComponent,
	attr,
	binding_callbacks,
	detach,
	element,
	init,
	insert,
	noop,
	null_to_empty,
	safe_not_equal
} from "../../_snowpack/pkg/svelte/internal.js";

import { afterUpdate } from "../../_snowpack/pkg/svelte.js";

function create_fragment(ctx) {
	let canvas_1;
	let canvas_1_class_value;

	return {
		c() {
			canvas_1 = element("canvas");
			attr(canvas_1, "class", canvas_1_class_value = "" + (null_to_empty(/*_class*/ ctx[0]) + " svelte-1yrzjzz"));
		},
		m(target, anchor) {
			insert(target, canvas_1, anchor);
			/*canvas_1_binding*/ ctx[4](canvas_1);
		},
		p(ctx, [dirty]) {
			if (dirty & /*_class*/ 1 && canvas_1_class_value !== (canvas_1_class_value = "" + (null_to_empty(/*_class*/ ctx[0]) + " svelte-1yrzjzz"))) {
				attr(canvas_1, "class", canvas_1_class_value);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(canvas_1);
			/*canvas_1_binding*/ ctx[4](null);
		}
	};
}

function setCanvas(canvas, imageData, color, scale, bgcolor, spotcolor) {
	const width = Math.sqrt(imageData.length);
	const size = width * scale;
	canvas.width = size;
	canvas.height = size;
	const cc = canvas.getContext("2d");

	if (cc) {
		cc.fillStyle = bgcolor;
		cc.fillRect(0, 0, canvas.width, canvas.height);
		cc.fillStyle = color;

		for (let i = 0; i < imageData.length; i++) {
			// if data is 2, choose spot color, if 1 choose foreground
			cc.fillStyle = imageData[i] === 1 ? color : spotcolor;

			// if data is 0, leave the background
			if (imageData[i]) {
				const row = Math.floor(i / width);
				const col = i % width;
				cc.fillRect(col * scale, row * scale, scale, scale);
			}
		}
	} else {
		console.error(`could not create 2d context for Blockie canvas`);
	}
}

function instance($$self, $$props, $$invalidate) {
	let { class: _class = "" } = $$props;
	let { address } = $$props;
	let { scale = 4 } = $$props;
	let lastOptions = undefined;
	let canvas;

	// The random number is a js implementation of the Xorshift PRNG
	const randseed = new Array(4); // Xorshift: [x, y, z, w] 32 bit values

	function seedrand(seed) {
		for (let i = 0; i < randseed.length; i++) {
			randseed[i] = 0;
		}

		for (let i = 0; i < seed.length; i++) {
			randseed[i % 4] = (randseed[i % 4] << 5) - randseed[i % 4] + seed.charCodeAt(i);
		}
	}

	function rand() {
		// based on Java's String.hashCode(), expanded to 4 32bit values
		const t = randseed[0] ^ randseed[0] << 11;

		randseed[0] = randseed[1];
		randseed[1] = randseed[2];
		randseed[2] = randseed[3];
		randseed[3] = randseed[3] ^ randseed[3] >> 19 ^ t ^ t >> 8;
		return (randseed[3] >>> 0) / (1 << 31 >>> 0);
	}

	function createColor() {
		// saturation is the whole color spectrum
		const h = Math.floor(rand() * 360);

		// saturation goes from 40 to 100, it avoids greyish colors
		const s = rand() * 60 + 40 + "%";

		// lightness can be anything from 0 to 100, but probabilities are a bell curve around 50%
		const l = (rand() + rand() + rand() + rand()) * 25 + "%";

		const color = "hsl(" + h + "," + s + "," + l + ")";
		return color;
	}

	function createImageData(size) {
		const width = size; // Only support square icons for now
		const height = size;
		const dataWidth = Math.ceil(width / 2);
		const mirrorWidth = width - dataWidth;
		const data = [];

		for (let y = 0; y < height; y++) {
			let row = [];

			for (let x = 0; x < dataWidth; x++) {
				// this makes foreground and background color to have a 43% (1/2.3) probability
				// spot color has 13% chance
				row[x] = Math.floor(rand() * 2.3);
			}

			const r = row.slice(0, mirrorWidth);
			r.reverse();
			row = row.concat(r);

			for (let i = 0; i < row.length; i++) {
				data.push(row[i]);
			}
		}

		return data;
	}

	function update() {
		if (lastOptions && lastOptions.address === address && lastOptions.scale === scale) {
			return;
		}

		lastOptions = { address, scale };
		seedrand(address && address.toLowerCase() || "0x0000000000000000000000000000000000000000");
		const color = createColor();
		const bgcolor = createColor();
		const spotcolor = createColor();
		const imageData = createImageData(8);
		setCanvas(canvas, imageData, color, scale, bgcolor, spotcolor);
	}

	afterUpdate(update);

	function canvas_1_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			canvas = $$value;
			$$invalidate(1, canvas);
		});
	}

	$$self.$$set = $$props => {
		if ("class" in $$props) $$invalidate(0, _class = $$props.class);
		if ("address" in $$props) $$invalidate(2, address = $$props.address);
		if ("scale" in $$props) $$invalidate(3, scale = $$props.scale);
	};

	return [_class, canvas, address, scale, canvas_1_binding];
}

class Blockie extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { class: 0, address: 2, scale: 3 });
	}
}

export default Blockie;
//# sourceMappingURL=Blockie.svelte.js.map
