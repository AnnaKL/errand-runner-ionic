class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :created_at, :updated_at, :auth_token, :lat, :lon, :username, :first_name, :last_name
end
