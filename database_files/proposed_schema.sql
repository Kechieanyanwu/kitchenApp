-- Checklist
CREATE TABLE checklist (
    checklist_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    grocery_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    purchased BOOLEAN DEFAULT FALSE,
    UNIQUE (grocery_name, checklist_id),
    FOREIGN KEY (unit_id) REFERENCES unit(unit_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- Categories
CREATE TABLE categories (
    category_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(50) NOT NULL UNIQUE
);

-- Units
CREATE TABLE unit (
    unit_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    unit_name VARCHAR(50) NOT NULL UNIQUE
);

-- Inventory 
CREATE TABLE inventory (
    inventory_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    item_name VARCHAR(255) NOT NULL UNIQUE,
    quantity INTEGER NOT NULL,
    unit_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    FOREIGN KEY (unit_id) REFERENCES unit(unit_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);



---DBML Version
---Storing this here instead of just on dbdiagram.io for ease of my retrieval

Project kitchenInventory {
	database_type: ‘PostgreSQL’
	Note: ‘Personal Project’
}

Table checklist {
  checklist_id integer [primary key, increment]
  grocery_name varchar(255) [not null]
  quantity integer [not null]
  unit_id integer [not null, ref: > unit.unit_id]
  category_id integer [not null, ref: > categories.category_id]
  timestamp timestamp [default: `current_timestamp`]
  purchased boolean [default: false]
  unique g_uniq_grocery_name (grocery_name, checklist_id)
}

Table categories {
  category_id integer [primary key, increment]
  category_name varchar(50) [not null, unique]
}

Table unit {
  unit_id integer [primary key, increment] 
  unit_name varchar(50) [not null, unique]
}

Table inventory {
  inventory_id integer [primary key, increment]
  item_name varchar(255) [unique, not null]
  quantity integer [not null]
  unit_id integer [not null, ref: > unit.unit_id]
  category_id integer [not null, ref: > categories.category_id] 
}
