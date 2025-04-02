use serde::{Deserialize, Serialize};
use tauri::{State, Manager};
use tokio::sync::Mutex;
use sqlx::{Pool, Sqlite, SqlitePool, Row};
use sqlx::sqlite::SqliteConnectOptions;
use std::fs;

struct AppState {
    internal_db: Mutex<Pool<Sqlite>>
}


#[derive(Serialize, Deserialize)]
struct DatabaseProfile {
    id: i32,
    name: String,
    db_type: String,
    default_database: String,
    host: String,
    user: String,
    password: String,
    port: i32,
}

pub fn run() {
    tauri::Builder::default().plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            tauri::async_runtime::spawn(async move {});
            tauri::async_runtime::block_on(async move {
                let _ = fs::create_dir_all(app.path().app_data_dir().unwrap());
                let db_path = app.path().app_config_dir().unwrap().join("database.db");
                println!("Database path: {:?}", db_path);

                let options = SqliteConnectOptions::new()
                    .filename(db_path)
                    .create_if_missing(true);
                let pool = SqlitePool::connect_with(options).await;
                match pool {
                    Ok(db) => {
                        app.manage(AppState {
            internal_db: Mutex::new(db.clone()), 
        });
                    }
                    Err(e) => {
                        println!("Failed to connect to the database");
                        println!("{}", e.to_string());
                    }
                }
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            init_internal_db,
            fetch_profiles,
            save_profile,
            delete_profile
        ])
        .run(tauri::generate_context!())
        .expect("error while running Tauri application");
}

#[tauri::command]
async fn init_internal_db(state: State<'_, AppState>) -> Result<(), String> {
    let pool = state.internal_db.lock().await;

    sqlx::query(
        "CREATE TABLE IF NOT EXISTS profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            db_type TEXT NOT NULL,
            default_database TEXT NOT NULL,
            host TEXT,
            user TEXT,
            password TEXT,
            port INTEGER
        )",
    )
    .execute(&*pool)
    .await
    .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
async fn fetch_profiles(state: State<'_, AppState>) -> Result<Vec<DatabaseProfile>, String> {
    let pool = state.internal_db.lock().await;

    let rows = sqlx::query(
        "SELECT id, name, db_type, default_database, host, user, password, port FROM profiles",
    )
    .map(|row: sqlx::sqlite::SqliteRow| DatabaseProfile {
        id: row.get("id"),
        name: row.get("name"),
        db_type: row.get("db_type"),
        default_database: row.get("default_database"),
        host: row.get("host"),
        user: row.get("user"),
        password: row.get("password"),
        port: row.get("port"),
    })
    .fetch_all(&*pool)
    .await
    .map_err(|e| e.to_string())?;

    Ok(rows)
}

#[tauri::command]
async fn save_profile(state: State<'_, AppState>, profile: DatabaseProfile) -> Result<(), String> {
    let pool = state.internal_db.lock().await;

    sqlx::query(
        "INSERT INTO profiles (name, db_type, default_database, host, user, password, port) 
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
    )
    .bind(&profile.name)
    .bind(&profile.db_type)
    .bind(&profile.default_database)
    .bind(&profile.host)
    .bind(&profile.user)
    .bind(&profile.password)
    .bind(&profile.port)
    .execute(&*pool)
    .await
    .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
async fn delete_profile(state: State<'_, AppState>, profile_id: i32) -> Result<(), String> {
    let pool = state.internal_db.lock().await;

    sqlx::query("DELETE FROM profiles WHERE id = ?1")
        .bind(profile_id)
        .execute(&*pool)
        .await
        .map_err(|e| e.to_string())?;

    Ok(())
}

