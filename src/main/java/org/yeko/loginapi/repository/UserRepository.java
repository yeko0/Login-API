package org.yeko.loginapi.repository;

import org.jspecify.annotations.Nullable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.yeko.loginapi.entity.User;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class UserRepository {
    private final JdbcTemplate jdbcTemplate;
    private final DataSource dataSource;

    public UserRepository(JdbcTemplate jdbcTemplate, DataSource dataSource) {
        this.jdbcTemplate = jdbcTemplate;
        this.dataSource = dataSource;
    }


    public boolean userNameExists(String userName){
        String sql = "SELECT 1 FROM users " +
                     "WHERE user_name = ? " +
                     "LIMIT 1";

        List<Integer> list = jdbcTemplate.query(sql, (rs, rowNum) -> rs.getInt(1), userName);
        return !list.isEmpty();

    }


    @Nullable
    private User getUser(PreparedStatement ps) throws SQLException {
        try(ResultSet rs = ps.executeQuery()){
            if(rs.next() ){
                User user = new User();

                user.setUserId(rs.getLong("user_id"));
                user.setUserName(rs.getString("user_name"));
                user.setUserPin(rs.getString("user_pin"));
                user.setUserRole(rs.getString("user_role"));

                return user;
            }
            return null;
        }
    }


    public User findUserByName(String userName) {
        String sql = "SELECT * FROM users " +
                "WHERE user_name = ?";

        try(Connection connection = dataSource.getConnection();
              PreparedStatement ps = connection.prepareStatement(sql)){

            ps.setString(1, userName);

            return getUser(ps);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }


    public User findUserById(Long id) {
        String sql = "SELECT * FROM users " +
                "WHERE user_id = ? ";

        try(Connection connection = dataSource.getConnection();
             PreparedStatement ps = connection.prepareStatement(sql)){

            ps.setLong(1, id);

            return getUser(ps);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }


    public long countAdmins(String role){
        String sql = "SELECT COUNT(*) FROM users WHERE user_role = ?";

        List<Long> list = jdbcTemplate.query(sql, (rs ,rowNum) -> rs.getLong(1), role);

        if( !list.isEmpty() ){
            return list.get(0);
        }

        return 0;
    }


    public User createUser(User user){
        String sql = "INSERT INTO users (user_name, user_pin) " +
                "VALUES (?, ?)";

        try(Connection connection = dataSource.getConnection();
               PreparedStatement ps = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS)){

            ps.setString(1, user.getUserName());
            ps.setString(2, user.getUserPin());

            int rowsAffected = ps.executeUpdate();

            if (rowsAffected == 1) {
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) {
                        return getUserById(rs.getLong(1));
                    }
                }
            }

            throw new RuntimeException("Error on user creation!");


        }catch(SQLException e){
            throw new RuntimeException(e);
        }
    }


    public boolean updateUserPin(Long id, String userPin){
        String sql = "UPDATE users " +
                "SET user_pin = ? " +
                "WHERE user_id = ? ";

        try(Connection connection = dataSource.getConnection();
            PreparedStatement ps = connection.prepareStatement(sql)){

            ps.setString(1, userPin);
            ps.setLong(2, id);

            return ps.executeUpdate() == 1;

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }


    public List<User> getAllUsers(){
        String sql = "SELECT user_id, user_name, user_role FROM users";
        List<User> users = new ArrayList<>();

        try(Connection connection = dataSource.getConnection();
            PreparedStatement ps = connection.prepareStatement(sql);
            ResultSet rs = ps.executeQuery()){

            while(rs.next()){
                User user = new User();
                user.setUserId(rs.getLong("user_id"));
                user.setUserName(rs.getString("user_name"));
                user.setUserRole(rs.getString("user_role"));

                users.add(user);
            }

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

        return users;
    }


    public boolean deleteUserById(Long id){
        String sql = "DELETE FROM users " +
                     "WHERE user_id = ?";

        try(Connection connection = dataSource.getConnection();
            PreparedStatement ps = connection.prepareStatement(sql)){

            ps.setLong(1, id);
            return ps.executeUpdate() == 1;

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }


    public User getUserById(Long id) {
        String sql = "SELECT user_id, user_name, user_role FROM users " +
                "WHERE user_id = ?";
        try(Connection connection = dataSource.getConnection();
            PreparedStatement ps = connection.prepareStatement(sql)){

            ps.setLong(1, id);

            try(ResultSet rs = ps.executeQuery()){
                if(rs.next()) {
                    User user = new User();
                    user.setUserId(rs.getLong("user_id"));
                    user.setUserName(rs.getString("user_name"));
                    user.setUserRole(rs.getString("user_role"));
                    return user;
                }
                return null;
            }

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }


    public boolean updateUserRole(Long id, String roleUpdate) {
        String sql ="UPDATE users SET user_role = ? " +
                "WHERE user_id = ?";

        try(Connection connection = dataSource.getConnection();
            PreparedStatement ps = connection.prepareStatement(sql)){

            ps.setString(1, roleUpdate);
            ps.setLong(2, id);
            return ps.executeUpdate() == 1;

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

    }


    public String getUserRoleFromDB(Long userId) {
        String sql = "SELECT user_role FROM users WHERE user_id = ?";

        try(Connection connection = dataSource.getConnection();
            PreparedStatement ps = connection.prepareStatement(sql)){

            ps.setLong(1, userId);

            try(ResultSet rs = ps.executeQuery()){
                if(rs.next()){
                    return rs.getString("user_role");
                }
            }
            return null;

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }


}