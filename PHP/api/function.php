<?php

require __DIR__ . '/../inc/dbcon.php';

function error422($message)
{
    $data = [
        'status' => 422,
        'message' => $message,
    ];
    header("HTTP/1.0 422 Unprocessable Entity");
    echo json_encode($data);
    exit();
}

function insertCategory($userInput)
{
    global $con;

        $category_name = $userInput['category_name'];


        if (empty(trim($category_name))) {
            return error422('category name is required');
        } else {
            mysqli_begin_transaction($con);

            $query = "INSERT INTO category_tbl (category_name) VALUES (?)";
            $stmt = $con->prepare($query);
            $stmt->bind_param('s',  $category_name);
            $result = $stmt->execute();
            $stmt->close();

            if ($result) {
                mysqli_commit($con);
                return json_encode([
                    'status' => 200,
                    'message' => 'Category inserted successfully.'
                ]);
            } else {
                mysqli_rollback($con);
                $data = [
                    'status' => 422,
                    'message' => 'Failed to insert category',
                ];
                header("HTTP/1.0 422 Failed to insert category");
                return json_encode($data);
            }
        }
}

function insertIngredient($userInput)
{
    global $con;

        $ingredient_name = $userInput['ingredient_name'];
        $measurement_unit = $userInput['measurement_unit'];
        $category_name = $userInput['category_name'];
        $unit_price = $userInput['unit_price'];

        if (empty(trim($ingredient_name))) {
            return error422('Ingredient name is required');
        } else if (empty(trim($measurement_unit))) {
            return error422('Measurement unit is required');
        } else if (empty(trim($category_name))) {
            return error422('Category name is required');
        } else if (empty(trim($unit_price))) {
            return error422('Unit price is required');
        }

            $categoryQuery = "SELECT category_id FROM category_tbl WHERE category_name = ?";
            $stmt = $con->prepare($categoryQuery);
            $stmt->bind_param('s', $category_name); 
            $stmt->execute();
            $stmt->store_result();

            if ($stmt->num_rows === 0) {
                $stmt->close();
                return error422('Invalid category name');
            }

            $category_id = null;
            $stmt->bind_result($category_id);
            $stmt->fetch();
            $stmt->close();

            mysqli_begin_transaction($con);

            $query = "INSERT INTO ingredients_tbl (ingredient_name, measurement_unit, category_id, unit_price) VALUES (?, ?, ?, ?)";
            $stmt = $con->prepare($query);
            $stmt->bind_param('ssid',  $ingredient_name, $measurement_unit, $category_id, $unit_price);
            $result = $stmt->execute();
            $stmt->close();

            if ($result) {
                mysqli_commit($con);
                return json_encode([
                    'status' => 200,
                    'message' => 'Ingredient inserted successfully.'
                ]);
            } else {
                mysqli_rollback($con);
                $data = [
                    'status' => 422,
                    'message' => 'Failed to insert Ingredient',
                ];
                header("HTTP/1.0 422 Failed to insert Ingredient");
                return json_encode($data);
            }
}

function insertMenuItem($userInput)
{
    global $con;

        $menu_item_name = $userInput['menu_item_name'];
        $selling_price = $userInput['selling_price'];


        if (empty(trim($menu_item_name))) {
            return error422('Menu item name is required');
        } else if (empty(trim($selling_price))) {
            return error422('Selling price is required');
        } else {
            mysqli_begin_transaction($con);

            $query = "INSERT INTO menu_items_tbl (menu_item_name, selling_price) VALUES (?,?)";
            $stmt = $con->prepare($query);
            $stmt->bind_param('sd',  $menu_item_name, $selling_price);
            $result = $stmt->execute();
            $stmt->close();

            if ($result) {
                mysqli_commit($con);
                return json_encode([
                    'status' => 200,
                    'message' => 'Menu Item inserted successfully.'
                ]);
            } else {
                mysqli_rollback($con);
                $data = [
                    'status' => 422,
                    'message' => 'Failed to insert Menu Item',
                ];
                header("HTTP/1.0 422 Failed to insert Menu Item");
                return json_encode($data);
            }
        }
}

function insertRecipe($userInput)
{
    global $con;

    $menu_item_name = $userInput['menu_item_name'];
    $selling_price = $userInput['selling_price'];
    $itemLoop = $userInput['items'];

    if (empty($itemLoop)) {
        return error422('Enter valid items');
    } 
    mysqli_begin_transaction($con);

        $query = "INSERT INTO menu_items_tbl (menu_item_name, selling_price) VALUES (?,?)";
        $stmt = $con->prepare($query);
        $stmt->bind_param('sd',  $menu_item_name, $selling_price);
        $result = $stmt->execute();
        $menu_item_id = $stmt->insert_id;
        $stmt->close();
    

        if ($result) {
            try {
                $insertedItemCount = 0;

                foreach ($itemLoop as $item) {
                    $ingredient_name = trim($item['ingredient_name']);
                    $quantity = trim($item['quantity']);

                    $ingredientQuery = "SELECT ingredients_id FROM ingredients_tbl WHERE ingredient_name = ?";
                    $stmt = $con->prepare($ingredientQuery);
                    $stmt->bind_param('s', $ingredient_name);
                    $stmt->execute();
                    $stmt->store_result();

                    if ($stmt->num_rows === 0) {
                        $stmt->close();
                        return error422('Invalid ingredient name');
                    }

                    $ingredients_id = null;
                    $stmt->bind_result($ingredients_id);
                    $stmt->fetch();
                    $stmt->close();

                    $query2 = "INSERT INTO recipe_ingredients_tbl (menu_item_id, ingredients_id, quantity) VALUES (?, ?, ?)";
                    $stmt2 = $con->prepare($query2);
                    $stmt2->bind_param('iii', $menu_item_id, $ingredients_id, $quantity);
                    $result2 = $stmt2->execute();
                    
                    if ($result2) {
                        $insertedItemCount++;
                    } else {
                        throw new Exception('Failed to insert item');
                    }
                }

                mysqli_commit($con);
                if ($insertedItemCount > 0) {

                    $data = [
                        'status' => 201,
                        'message' => 'Recipe Inserted ' . $insertedItemCount . ' items',
                    ];
                    header("HTTP/1.0 201 Updated");
                    return json_encode($data);
                } else {
                    $data = [
                        'status' => 400,
                        'message' => 'No Donation were added',
                    ];
                    header("HTTP/1.0 500 Internal Server Error");
                    return json_encode($data);
                }
            } catch (Exception $e) {
                mysqli_rollback($con);
                $data = [
                    'status' => 500,
                    'message' => $e->getMessage(),
                ];
                header("HTTP/1.0 500 Internal Server Error");
                return json_encode($data);
            }
        } else {
            $data = [
                'status' => 500,
                'message' => 'Internal Server Error',
            ];
            header("HTTP/1.0 500 Internal Server Error");
            return json_encode($data);
        }
}

function insertOrder($userInput)
{
    global $con;

        $menu_item_name = $userInput['menu_item_name'];
        $quantity = $userInput['quantity'];
        $total_price = $userInput['total_price'];

        if (empty(trim($menu_item_name))) {
            return error422('Menu Item name is required');
        } else if (empty(trim($quantity))) {
            return error422('Quantity is required');
        } else if (empty(trim($total_price))) {
            return error422('Total Price is required');
        } else {

            $menuItemQuery = "SELECT menu_item_id FROM menu_items_tbl WHERE menu_item_name = ?";
            $stmt = $con->prepare($menuItemQuery);
            $stmt->bind_param('s', $menu_item_name); 
            $stmt->execute();
            $stmt->store_result();

            if ($stmt->num_rows === 0) {
                $stmt->close();
                return error422('Invalid category name');
            }

            $menu_item_id = null;
            $stmt->bind_result($menu_item_id);
            $stmt->fetch();
            $stmt->close();

            mysqli_begin_transaction($con);

            $query = "INSERT INTO orders_tbl (menu_item_id, quantity, total_price, order_date) VALUES (?, ?, ?, NOW())";
            $stmt = $con->prepare($query);
            $stmt->bind_param('iid',  $menu_item_id, $quantity, $total_price);
            $result = $stmt->execute();
            $stmt->close();

            if ($result) {
                mysqli_commit($con);
                return json_encode([
                    'status' => 200,
                    'message' => 'Order inserted successfully.'
                ]);
            } else {
                mysqli_rollback($con);
                $data = [
                    'status' => 422,
                    'message' => 'Failed to insert Order',
                ];
                header("HTTP/1.0 422 Failed to insert Order");
                return json_encode($data);
            }
        }
}

function insertStock($userInput)
{
    global $con;

        $ingredient_name = $userInput['ingredient_name'];
        $qty = $userInput['qty'];

        if (empty(trim($ingredient_name))) {
            return error422('Menu Item name is required');
        } else if (empty(trim($qty))) {
            return error422('qty is required');
        } else {

            $ingredientQuery = "SELECT ingredients_id, unit_price FROM ingredients_tbl WHERE ingredient_name = ?";
            $stmt = $con->prepare($ingredientQuery);
            $stmt->bind_param('s', $ingredient_name); 
            $stmt->execute();
            $stmt->store_result();

            if ($stmt->num_rows === 0) {
                $stmt->close();
                return error422('Invalid ingredient name');
            }

            $ingredients_id = null;
            $unit_price = null;
            $stmt->bind_result($ingredients_id, $unit_price);
            $stmt->fetch();
            $stmt->close();

            $total_price = $qty * $unit_price;

            $stockQuery = "SELECT total_stock, qty FROM stock_ingredients_tbl WHERE ingredients_id = ?";
            $stmt = $con->prepare($stockQuery);
            $stmt->bind_param('i', $ingredients_id);
            $stmt->execute();
            $stmt->store_result();

            $current_total_stock = 0;
            $current_qty = 0;
            if ($stmt->num_rows > 0) {
                $stmt->bind_result( $current_total_stock, $current_qty);
                $stmt->fetch();
            }
            $stmt->close();

            $total_stock = $current_total_stock + $qty;
            $qty = $current_qty + $qty;

            mysqli_begin_transaction($con);

            $checkStockQuery = "SELECT 1 FROM stock_ingredients_tbl WHERE ingredients_id = ?";
            $stmt = $con->prepare($checkStockQuery);
            $stmt->bind_param('i', $ingredients_id);
            $stmt->execute();
            $stmt->store_result();
            $stockExists = $stmt->num_rows > 0;
            $stmt->close();

            if ($stockExists) {
                $query = "UPDATE stock_ingredients_tbl SET qty = ?, total_stock = ?, total_price = total_price + ? WHERE ingredients_id = ?";
                $stmt = $con->prepare($query);
                $stmt->bind_param('iidi', $qty, $total_stock, $total_price, $ingredients_id);
            } else {
                $query = "INSERT INTO stock_ingredients_tbl (ingredients_id, qty, total_stock, total_price) VALUES (?, ?, ?, ?)";
                $stmt = $con->prepare($query);
                $stmt->bind_param('iiid', $ingredients_id, $qty, $total_stock, $total_price);
            }
    
            $result = $stmt->execute();
            $stmt->close();

            if ($result) {
                mysqli_commit($con);
                return json_encode([
                    'status' => 200,
                    'message' => 'Stock inserted/updated successfully.'
                ]);
            } else {
                mysqli_rollback($con);
                $data = [
                    'status' => 422,
                    'message' => 'Failed to nsert/update stock',
                ];
                header("HTTP/1.0 422 Failed to nsert/update stock");
                return json_encode($data);
            }
        }
}

function readCategoryTbl()
{
    global $con;

    $query = "SELECT 
        category_tbl.category_id,
        category_tbl.category_name
    FROM
        category_tbl";
    $stmt = $con->prepare($query);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();

    if ($result->num_rows > 0) {
        $data = [
            'status' => 200,
            'message' => 'Categories retrieved successfully',
            'data' => $result->fetch_all(MYSQLI_ASSOC)
        ];
        header("HTTP/1.0 200 OK");
        return json_encode($data);
    } else {
        $data = [
            'status' => 404,
            'message' => 'No Categories found'
        ];
        header("HTTP/1.0 404 Not Found");
        return json_encode($data);
    }
}

function readIngredientsTbl()
{
    global $con;

    $query = "SELECT 
        ingredients_tbl.ingredients_id,
        ingredients_tbl.ingredient_name,
        ingredients_tbl.measurement_unit,
        category_tbl.category_name,
        ingredients_tbl.unit_price
    FROM
        ingredients_tbl
    INNER JOIN
        category_tbl ON ingredients_tbl.category_id = category_tbl.category_id";
    $stmt = $con->prepare($query);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();

    if ($result->num_rows > 0) {
        $data = [
            'status' => 200,
            'message' => 'Ingredients retrieved successfully',
            'data' => $result->fetch_all(MYSQLI_ASSOC)
        ];
        header("HTTP/1.0 200 OK");
        return json_encode($data);
    } else {
        $data = [
            'status' => 404,
            'message' => 'No Ingredients found'
        ];
        header("HTTP/1.0 404 Not Found");
        return json_encode($data);
    }
}

function readStockIngredientsTbl()
{
    global $con;

    $query = "SELECT 
        stock_ingredients_tbl.ingredients_id,
        ingredients_tbl.ingredient_name,
        stock_ingredients_tbl.qty,
        stock_ingredients_tbl.total_stock,
        stock_ingredients_tbl.total_price
    FROM
        stock_ingredients_tbl
    INNER JOIN
        ingredients_tbl ON stock_ingredients_tbl.ingredients_id = ingredients_tbl.ingredients_id";
    $stmt = $con->prepare($query);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();

    if ($result->num_rows > 0) {
        $data = [
            'status' => 200,
            'message' => 'Stock Ingredients retrieved successfully',
            'data' => $result->fetch_all(MYSQLI_ASSOC)
        ];
        header("HTTP/1.0 200 OK");
        return json_encode($data);
    } else {
        $data = [
            'status' => 404,
            'message' => 'No Stock Ingredients found'
        ];
        header("HTTP/1.0 404 Not Found");
        return json_encode($data);
    }
}


function readMenuItemsTbl()
{
    global $con;

    $query = "SELECT 
        menu_items_tbl.menu_item_id,
        menu_items_tbl.menu_item_name,
        menu_items_tbl.selling_price
    FROM
        menu_items_tbl";
    $stmt = $con->prepare($query);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();

    if ($result->num_rows > 0) {
        $data = [
            'status' => 200,
            'message' => 'Menu Items retrieved successfully',
            'data' => $result->fetch_all(MYSQLI_ASSOC)
        ];
        header("HTTP/1.0 200 OK");
        return json_encode($data);
    } else {
        $data = [
            'status' => 404,
            'message' => 'No Menu Items found'
        ];
        header("HTTP/1.0 404 Not Found");
        return json_encode($data);
    }
}

function singleReadRecipeIngTbl()
{
    global $con;

    $query = "SELECT 
        recipe_ingredients_tbl.recipe_ingredients_id,
        menu_items_tbl.menu_item_name,
        ingredients_tbl.ingredient_name,
        recipe_ingredients_tbl.quantity
    FROM
        recipe_ingredients_tbl
    INNER JOIN menu_items_tbl ON recipe_ingredients_tbl.menu_item_id = menu_items_tbl.menu_item_id
    INNER JOIN ingredients_tbl ON recipe_ingredients_tbl.ingredients_id = ingredients_tbl.ingredients_id";
        
    $stmt = $con->prepare($query);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();

    $recipeData = [];

    if ($result->num_rows > 0) {

        while ($row = $result->fetch_assoc()) {
            $menuItemName = $row['menu_item_name'];
            $ingredientName = $row['ingredient_name'];
            $quantity = $row['quantity'];

            if (!isset($recipeData[$menuItemName])) {
                $recipeData[$menuItemName] = [
                    'menu_item_name' => $menuItemName,
                    'ingredients' => []
                ];
            }

            $recipeData[$menuItemName]['ingredients'][] = [
                'ingredient_name' => $ingredientName,
                'quantity' => $quantity
            ];
        }

        $data = [
            'status' => 200,
            'message' => 'Recipe Ingredients retrieved successfully',
            'data' => array_values($recipeData)
        ];
        header("HTTP/1.0 200 OK");
        return json_encode($data);
    } else {
        $data = [
            'status' => 404,
            'message' => 'No Recipe Ingredients found'
        ];
        header("HTTP/1.0 404 Not Found");
        return json_encode($data);
    }
}

function readOrdersTbl()
{
    global $con;

    $query = "SELECT 
        orders_tbl.order_id,
        menu_items_tbl.menu_item_name,
        orders_tbl.quantity,
        orders_tbl.total_price,
        DATE_FORMAT(orders_tbl.order_date, '%d %M %Y, %h:%i %p') AS order_date

    FROM
        orders_tbl
    INNER JOIN
        menu_items_tbl ON orders_tbl.menu_item_id = menu_items_tbl.menu_item_id";
    $stmt = $con->prepare($query);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();

    if ($result->num_rows > 0) {
        $data = [
            'status' => 200,
            'message' => 'Orders retrieved successfully',
            'data' => $result->fetch_all(MYSQLI_ASSOC)
        ];
        header("HTTP/1.0 200 OK");
        return json_encode($data);
    } else {
        $data = [
            'status' => 404,
            'message' => 'No Orders Ingredients found'
        ];
        header("HTTP/1.0 404 Not Found");
        return json_encode($data);
    }
}

