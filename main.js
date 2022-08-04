const DIRS = [{x:0,y:1}, {x:1,y:0}, {x:0,y:-1}, {x:-1,y:0}]
const SIZE = 10

const newTileType =(name,i,R,...a) => {
	types = []
	for(let r = 0; r <= R*3; r ++) {
		types.push({
			img: (()=>{
				let img = document.createElement('img')
				img.src = `${name}${i}.png`
				img.style.transform = `rotate(${r/4}turn)`
				return img
			})(),
			rules: a.map((_,i)=>a[(i+r)%4])
		})
	}
	return types
}

class Cell {
	constructor(tile_types, x, y) {
		this.options = tile_types
		this.x = x
		this.y = y
	}
}

Array.prototype.sample = function(){
  return this[0 | Math.random() * this.length];
}

const newGrid =(s, tile_types)=> [...new Array(s*s)].map((_,i)=> new Cell(tile_types, i%s, 0|i/s))

let main=(SIZE, settings)=> {
	tile_types = settings.tiles.map(v=>newTileType(settings.names,...v)).flat()

	let grid = newGrid(SIZE, tile_types)
	let unchosen = [...grid]
	
	while(1) {

		let _unchosen = unchosen.filter(v=>v!=undefined)

		if(_unchosen.length == 0)
			break;

		let min = Math.min(..._unchosen.map(v=>v.options.length))
		let selected = _unchosen.filter(v=> v.options.length == min).sample()

		selected.options = [selected.options.sample()]
		delete unchosen[ selected.x + SIZE * selected.y]

		DIRS.some((d,i)=>{
			let adj = unchosen[selected.x+d.x + SIZE * (selected.y+d.y)]
			if (adj == undefined || selected.x+d.x == SIZE || selected.x+d.x == -1) return

			adj.options = adj.options.filter(v=> v.rules[(i+2)%4] == selected.options[0].rules[i])

			if (adj.options.length == 0) {
				grid = newGrid(SIZE, tile_types)
				unchosen = [...grid]
				return true
			}
		})
	}

	document.body.innerHTML = ''
	grid.forEach((v,i)=> {
		let img = unchosen.includes(v) 
				? document.createElement('img') 
				: v.options[0].img.cloneNode()
		if(settings.pixelated)
			img.style.imageRendering = "pixelated"
		img.style.width = img.style.height = `${100/SIZE}%`
		document.body.appendChild(img)
	})
}