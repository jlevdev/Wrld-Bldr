import Shop from "../data/Shop";
import Random from "../utils/Random";
import Model from "./Model";

export default class District extends Array {

    //NOTE: no f's in colors or it will ruin the hover effect
    static availableColors = [
//        '#afd1d4', '#bf8597', '#fbb2a0', '#fbe7b4', '#f4efc4',
        '#E3BBBB', '#DBDDA5', '#AAE3D9', '#9BBEDE', '#C4B7D4',
        '#E0ADE6', '#B5D695', '#E3CBA2', '#E49BC3', '#EA9696',
//        '#eeaaa9', '#bda9c7', '#c3d3ee', '#a0e4ea', '#90d4dc'
    ];

    color

    constructor(d = null) {
		super()
		if (!Array.isArray(d))
			Object.assign(this, [])
		else
            Object.assign(this, d.slice(0))

        Model.instance.allDistricts.push(this);

        if (typeof Model.instance.availableColors == 'undefined')
            Model.instance.availableColors = District.availableColors.slice(0);
        
        this.color = Model.instance.availableColors.splice(Random.int(0, Model.instance.availableColors.length), 1)[0];
    }

    static cleanUp() {
        for (let i = 0; i < Model.instance.allDistricts.length; i++) {
            const d = Model.instance.allDistricts[i];
            d.removePatches();
        }
    }

    push(...wards) {
        wards.forEach(w => {
            w.district = this;
            super.push(w);
        });
    }

    replace(target, replacement) {
        for (let i = 0; i < this.length; i++) {
            const item = this[i];
            if (target == item) {
                target.district = null;
                replacement.district = this;
                this.splice(i, 1, replacement);
                return true;
            }
        }
        return false;
    }

    removePatches() {
        let hasPatches = true;
        let i = 0;
        while (hasPatches) {
            const item = this[i];
            if (!item instanceof Shop) {
                this.splice(i, 1);
                i = -1;
            }
            if (i==this.length-1)
                hasPatches = false;
            i++;
        }
        
    }

}