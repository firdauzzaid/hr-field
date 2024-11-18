from flask import Flask, render_template, request, redirect, url_for, flash, jsonify

import pymysql
import pymysql.cursors

app = Flask(__name__)
app.secret_key = "your_secret_key"

db_config = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "interview",
    "cursorclass": pymysql.cursors.DictCursor
}


def get_connection():
    return pymysql.connect(**db_config)

@app.route('/')
def index():
    data = []

    try:
        with get_connection() as conn:
            with conn.cursor() as cursor:
                query = "SELECT * FROM calon_karyawan"
                cursor.execute(query)
                data = cursor.fetchall()
    except Exception as e:
        flash(f'Error: {str(e)}')

    return render_template('index.html', data=data)


@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('query', '')
    data = []

    try:
        with get_connection() as conn:
            with conn.cursor() as cursor:
                if query:
                    search_query = f"%{query}%"
                    sql = """
                    SELECT * FROM calon_karyawan
                    WHERE name LIKE %s OR phone LIKE %s OR date LIKE %s
                    """
                    cursor.execute(sql, (search_query, search_query, search_query))
                else:
                    cursor.execute("SELECT * FROM calon_karyawan")

                data = cursor.fetchall()

    except Exception as e:
        print(f"Error: {e}")

    return jsonify(data)


@app.route('/add', methods=['POST'])
def add_data():
    name = request.form['name']
    phone = request.form['phone']
    date = request.form['date']

    try:
        with get_connection() as conn:
            with conn.cursor() as cursor:
                query = "INSERT INTO calon_karyawan (name, phone, date) VALUES (%s, %s, %s)"
                cursor.execute(query, (name, phone, date))
                conn.commit()
        flash('Data successfully added!', 'success')
    except Exception as e:
        flash(f'Error: {str(e)}', 'danger')

    return redirect(url_for('index'))


@app.route('/edit/<int:id>', methods=['GET', 'POST'])
def edit_data(id):
    if request.method == 'POST':
        name = request.form['name']
        phone = request.form['phone']
        date = request.form['date']

        try:
            with get_connection() as conn:
                with conn.cursor() as cursor:
                    query = "UPDATE calon_karyawan SET name=%s, phone=%s, date=%s WHERE id=%s"
                    cursor.execute(query, (name, phone, date, id))
                    conn.commit()
            flash('Successfully Updated!', 'success')
        except Exception as e:
            flash(f'Error: {str(e)}', 'danger')

        return redirect(url_for('index'))

    else:
        with get_connection() as conn:
            with conn.cursor() as cursor:
                query = "SELECT * FROM calon_karyawan WHERE id=%s"
                cursor.execute(query, (id,))
                data = cursor.fetchone()

        return render_template('index.html', data=data)


@app.route('/delete/<int:id>', methods=['POST'])
def delete_data(id):
    try:
        with get_connection() as conn:
            with conn.cursor() as cursor:
                query = "DELETE FROM calon_karyawan WHERE id=%s"
                cursor.execute(query, (id,))
                conn.commit()
        flash('Data has been deleted!', 'success')
    except Exception as e:
        flash(f'Error: {str(e)}', 'danger')

    return redirect(url_for('index'))


@app.route('/delete_all', methods=['POST'])
def delete_all_data():
    try:
        with get_connection() as conn:
            with conn.cursor() as cursor:
                query = "DELETE FROM calon_karyawan"
                cursor.execute(query)
                conn.commit()
        flash('All data has been deleted!', 'success')
    except Exception as e:
        flash(f'Error: {str(e)}', 'danger')

    return redirect(url_for('index'))


if __name__ == "__main__":
    app.run(debug=True)