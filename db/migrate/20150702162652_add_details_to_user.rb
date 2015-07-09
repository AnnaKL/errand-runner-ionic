class AddDetailsToUser < ActiveRecord::Migration
  def change
    add_column :users, :lon, :decimal
    add_column :users, :lat, :decimal
  end
end
