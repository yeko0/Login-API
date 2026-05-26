package org.yeko.loginapi.repository;

import org.jspecify.annotations.Nullable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.yeko.loginapi.entity.User;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class UserRepository {
    private final JdbcTemplate jdbcTemplate;

    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }


    public boolean userNameExists(String userName){
        String sql = "SELECT 1 FROM users " +
                     "WHERE user_name = ? " +
                     "LIMIT 1";

        List<Integer> list = jdbcTemplate.query(sql, (rs, rowNum) -> rs.getInt(1), userName);
        return !list.isEmpty();

    }


    private User resultsetToUser(ResultSet rs) throws SQLException {

        User user = new User();

        user.setUserId(rs.getLong("user_id"));
        user.setUserName(rs.getString("user_name"));
        user.setUserPin(rs.getString("user_pin"));
        user.setUserRole(rs.getString("user_role"));

        return user;
    }


    private User resultsetToPublicUser(ResultSet rs) throws SQLException {

        User user = new User();

        user.setUserId(rs.getLong("user_id"));
        user.setUserName(rs.getString("user_name"));
        user.setUserRole(rs.getString("user_role"));

        return user;
    }


    @Nullable
    public User findUserByName(String userName) {
        String sql = "SELECT * FROM users " +
                "WHERE user_name = ?";

        List<User> users = jdbcTemplate.query(sql, (rs, rowNum) -> resultsetToUser(rs), userName);

        if(!users.isEmpty() ){
            return users.get(0);
        }

        return null;

    }


    @Nullable
    public User findUserById(Long id) {
        String sql = "SELECT * FROM users " +
                "WHERE user_id = ? ";

        List<User> users = jdbcTemplate.query(sql, (rs, rowNum) -> resultsetToUser(rs), id);

        if(!users.isEmpty()){
            return users.get(0);
        }

        return null;

    }


    @Nullable
    public User findPublicUserByName(String userName) {
        String sql = "SELECT user_id, user_name, user_role FROM users " +
                "WHERE user_name = ?";

        List<User> users = jdbcTemplate.query(sql, (rs, rowNum) -> resultsetToPublicUser(rs), userName);

        if(!users.isEmpty() ){
            return users.get(0);
        }

        return null;

    }


    @Nullable
    public User findPublicUserById(Long id) {
        String sql = "SELECT user_id, user_name, user_role FROM users " +
                "WHERE user_id = ? ";

        List<User> users = jdbcTemplate.query(sql, (rs, rowNum) -> resultsetToPublicUser(rs), id);

        if(!users.isEmpty()){
            return users.get(0);
        }

        return null;

    }


    public Long countAdmins(String role){
        String sql = "SELECT COUNT(*) FROM users WHERE user_role = ?";

        return jdbcTemplate.queryForObject(sql, Long.class, role);
    }


    @Nullable
    public User createUser(User user) {
        String sql = "INSERT INTO users (user_name, user_pin) "+
                "VALUES (?, ?)";

        int rowsAffected = jdbcTemplate.update(sql, user.getUserName(), user.getUserPin());

        if (rowsAffected == 1) {
            return findPublicUserByName(user.getUserName());
        }

        return null;
    }


    public boolean updateUserPin(Long id, String userPin){
        String sql = "UPDATE users " +
                "SET user_pin = ? " +
                "WHERE user_id = ? ";

        return  jdbcTemplate.update(sql, userPin, id) == 1;
    }


    public List<User> getAllUsers(){
        String sql = "SELECT user_id, user_name, user_role FROM users";

        return jdbcTemplate.query(sql, (rs, rowNum) -> resultsetToPublicUser(rs));
    }


    public boolean deleteUserById(Long id){
        String sql = "DELETE FROM users " +
                     "WHERE user_id = ?";

        return jdbcTemplate.update(sql, id) == 1;
    }


    public boolean updateUserRole(Long id, String roleUpdate) {
        String sql ="UPDATE users SET user_role = ? " +
                "WHERE user_id = ?";

        return jdbcTemplate.update(sql, roleUpdate, id) == 1;
    }


    @Nullable
    public String getUserRoleFromDB(Long userId) {
        String sql = "SELECT user_role FROM users WHERE user_id = ?";

        List<String> listRole = jdbcTemplate.query(sql, (rs, rowNum) -> rs.getString(1), userId);

        if(!listRole.isEmpty() ){
            return listRole.get(0);
        }

        return null;
    }


}