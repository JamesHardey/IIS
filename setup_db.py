


def setup_db(conn):
    conn.execute('CREATE TABLE scores(student_id, test_id, scores)')
    print('Table scores successfully created')