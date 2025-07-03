<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'db_connect.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

function ensureUserExists($conn, $auth0_id, $email, $name) {
    try {
        // First try to find by auth0_id
        $stmt = $conn->prepare("SELECT id FROM users WHERE auth0_id = ?");
        if (!$stmt) throw new Exception("Prepare failed: " . $conn->error);
        
        $stmt->bind_param("s", $auth0_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            // If not found by auth0_id, try by email
            $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows === 0) {
                // User doesn't exist, create new
                $stmt = $conn->prepare("INSERT INTO users (email, name, auth0_id) VALUES (?, ?, ?)");
                if (!$stmt) throw new Exception("Prepare failed: " . $conn->error);
                
                $stmt->bind_param("sss", $email, $name, $auth0_id);
                $stmt->execute();
                return $conn->insert_id;
            } else {
                // User exists by email but not auth0_id - update with auth0_id
                $user = $result->fetch_assoc();
                $update = $conn->prepare("UPDATE users SET auth0_id = ? WHERE id = ?");
                $update->bind_param("si", $auth0_id, $user['id']);
                $update->execute();
                return $user['id'];
            }
        } else {
            $user = $result->fetch_assoc();
            return $user['id'];
        }
    } catch (Exception $e) {
        error_log("User check error: " . $e->getMessage());
        throw $e;
    }
}

// GET Bookings
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $user_id = isset($_GET['user_id']) ? $_GET['user_id'] : null;

        if ($user_id) {
            // First find the internal user ID based on auth0_id
            $stmt = $conn->prepare("SELECT id FROM users WHERE auth0_id = ?");
            $stmt->bind_param("s", $user_id);
            $stmt->execute();
            $user_result = $stmt->get_result();
            
            if ($user_result->num_rows === 0) {
                echo json_encode([]);
                exit;
            }
            
            $user = $user_result->fetch_assoc();
            $internal_user_id = $user['id'];
            
            // Now get bookings for this user
            $stmt = $conn->prepare("SELECT b.*, r.name as room_name FROM bookings b JOIN rooms r ON b.room_id = r.id WHERE b.user_id = ?");
            $stmt->bind_param("i", $internal_user_id);
        } else {
            $stmt = $conn->prepare("SELECT b.*, r.name as room_name FROM bookings b JOIN rooms r ON b.room_id = r.id");
        }

        $stmt->execute();
        $result = $stmt->get_result();
        $bookings = [];

        while ($row = $result->fetch_assoc()) {
            $bookings[] = $row;
        }

        echo json_encode($bookings);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        
        error_log("Received data: " . print_r($data, true));

        if (!isset($data['room_id'], $data['user_id'], $data['user_email'], $data['user_name'], $data['start_time'], $data['end_time'])) {
            throw new Exception('Missing required fields');
        }

        $room_id = $data['room_id'];
        $auth0_id = $data['user_id'];
        $email = $data['user_email'];
        $name = $data['user_name'];
        $start_time = $data['start_time'];
        $end_time = $data['end_time'];

        $user_id = ensureUserExists($conn, $auth0_id, $email, $name);

        // Check for booking conflicts
        $query = "SELECT * FROM bookings WHERE room_id = ? AND (
            (start_time <= ? AND end_time >= ?) OR
            (start_time <= ? AND end_time >= ?) OR
            (start_time >= ? AND end_time <= ?)
        )";

        $stmt = $conn->prepare($query);
        $stmt->bind_param("issssss",
            $room_id, $start_time, $start_time,
            $end_time, $end_time, $start_time, $end_time
        );
        $stmt->execute();
        $conflict_result = $stmt->get_result();

        if ($conflict_result->num_rows > 0) {
            http_response_code(409);
            echo json_encode(['error' => 'Booking conflict detected']);
            exit;
        }

        // Create new booking
        $insert = "INSERT INTO bookings (room_id, user_id, start_time, end_time) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($insert);
        $stmt->bind_param("iiss", $room_id, $user_id, $start_time, $end_time);
        $stmt->execute();
        $booking_id = $conn->insert_id;

        // Return the newly created booking
        $stmt = $conn->prepare("SELECT b.*, r.name as room_name FROM bookings b JOIN rooms r ON b.room_id = r.id WHERE b.id = ?");
        $stmt->bind_param("i", $booking_id);
        $stmt->execute();
        $result = $stmt->get_result();

        http_response_code(201);
        echo json_encode([
            'success' => true,
            'booking' => $result->fetch_assoc()
        ]);
    } catch (Exception $e) {
        error_log("API Error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'error' => $e->getMessage(),
            'trace' => $e->getTrace()
        ]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    try {
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing booking ID']);
            exit;
        }

        $id = $_GET['id'];
        $stmt = $conn->prepare("DELETE FROM bookings WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();

        echo json_encode(['message' => 'Booking deleted']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

mysqli_close($conn);
?>