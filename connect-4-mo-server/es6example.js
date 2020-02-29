class Rooms {
  constructor(type){
    this.type = type;
    this.rooms = new Map();
  }
  addRoom(key, value) {
    this.rooms.set(key, new this.type(value));
  }
  getRooms(){
    return this.rooms;
  }
  
}

class ChatRoom {
  constructor(value){
    this.value = value;
  }
	getValue() {
		return this.value;
	}
}
class GameRoom {
  constructor(value){
    this.value = value;
  }
	getValue() {
		return this.value;
	}
}
// test
let gameRooms = new Rooms(GameRoom);
gameRooms.addRoom('game1', {name: 'game1'})
console.log(gameRooms.getRooms())


// ------------------------ a better way? --------------------------
class TypedMap extends Map {
	// nodejs seems don't support var declaration
	constructor(type) {
    if (typeof type !== 'function' && type.name)
			throw `Map Type must be a class`;
    super();
    this.type = type;
	}
	// then rewrite function as needed
	set(key, value) {
		if (value.constructor.name !== this.type.name) 
			throw `Invalid Type, must be ${this.type.name}`;
		super.set(key, value);
	}
}

// test
console.log('-------------------------------------');
let chatRooms = new TypedMap(ChatRoom);
chatRooms.set('cRoom1', new ChatRoom({users: 4}));
console.log(chatRooms.get('cRoom1').getValue());
